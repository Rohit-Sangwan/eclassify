'use client'
import { isLogin, t } from "@/utils"
import { getVerificationFiledsApi, getVerificationStatusApi, sendVerificationReqApi } from "@/utils/api"
import { useEffect, useState } from "react"
import { Checkbox, Radio } from 'antd'
import { FaAngleDown } from "react-icons/fa6"
import { HiOutlineUpload } from "react-icons/hi"
import { MdOutlineAttachFile } from "react-icons/md"
import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"
import { useRouter } from "next/navigation"


const UserVerification = () => {

  const router = useRouter()
  const [UserVeriFields, setUserVeriFields] = useState([])
  const [Details, setDetails] = useState({})
  const [filePreviews, setFilePreviews] = useState({});
  const [VerificationStatus, setVerificationStatus] = useState('')


  const getVerificationProgress = async () => {
    try {
      const res = await getVerificationStatusApi.getVerificationStatus();
      const verificationFieldValues = res?.data?.data?.verification_field_values;

      if (res?.data?.error === true) {
        setVerificationStatus('not applied')
      }
      else {
        const status = res?.data?.data?.status
        setVerificationStatus(status);
      }

      if (verificationFieldValues && verificationFieldValues.length > 0) {
        // Create an object with id as the key and value(s) as the value (array if comma-separated)
        const detailsObj = verificationFieldValues.reduce((acc, field) => {
          if (typeof field.value === 'string' && field.value.includes(',')) {
            // If the value contains commas, split it into an array
            acc[field.verification_field_id] = field.value.split(',').map(item => item.trim());
          } else {
            // Otherwise, just store the value as it is
            acc[field.verification_field_id] = field.value;
          }
          return acc;
        }, {});
        // Set the result to the Details state
        setDetails(detailsObj);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getVeriFields = async () => {
    try {
      const res = await getVerificationFiledsApi.getVerificationFileds()
      const data = res?.data?.data
      setUserVeriFields(data)

      if (VerificationStatus === 'not applied') {
        const updatedFields = data.reduce((acc, field) => {
          return { ...acc, [field?.id]: "" };  // Set field id as the key and an empty string as the value
        }, {});

        setDetails(updatedFields);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (isLogin()) {
      getVerificationProgress()
      getVeriFields()
    }

  }, [])


  const renderInputField = (field) => {
    let { id, name, type, values, min_length, max_length } = field;

    const inputProps = {
      id,
      name,
      onChange: (e) => handleChange(id, e.target.value),
      value: Details[id] || '',
      ...(type === 'number'
        ? { min: min_length, max: max_length }
        : { minLength: min_length, maxLength: max_length }
      )
    };

    switch (type) {
      case 'number':
        {
          return <div className="input-container">
            <input
              type={type}
              inputMode={'numeric'}
              placeholder={`${t('enter')} ${name}`}
              {...inputProps}
              onKeyDown={(e) => handleKeyDown(e, max_length)}
              onKeyPress={(e) => inpNum(e)}
              className={`userVerInputs ${Details[id] ? 'bg' : ''}`}
              required
            />
            {max_length && (
              <span className='inputLength'>
                {`${Details[id] ? Details[id].length : 0}/${max_length}`}
              </span>
            )}
          </div>
        }
      case 'textbox':
        return <div className="input-container">
          <textarea
            placeholder={`${t('enter')} ${name}`}
            className={`userVerInputs ${Details[id] ? 'bg' : ''}`}
            {...inputProps}
            required
          />
          {max_length !== null && (
            <span className='inputLength'>
              {`${Details[id] ? Details[id].length : 0}/${max_length}`}
            </span>
          )}
        </div>
      case 'fileinput':
        const fileUrl = filePreviews[id]?.url;
        return (
          <>
            <label htmlFor={id} className='fileinput_wrap'>
              <div className='click_upld_wrap'>
                <HiOutlineUpload size={24} fontWeight='400' />
              </div>
              {filePreviews[id] && (
                <div className='file_wrap'>
                  {filePreviews[id]?.isPdf ? (
                    <>
                      <MdOutlineAttachFile className='file_icon' />
                      <Link href={fileUrl} target="_blank" rel="noopener noreferrer">{t('viewPdf')}</Link>
                    </>
                  ) : (
                    <Image src={fileUrl} alt="Preview" width={36} height={36} className="file_preview" />
                  )}
                </div>
              )}

            </label>
            <input type="file" id={id} name={name} className='fileinput' onChange={(e) => handleFileChange(id, e.target.files[0])} required />
            <span className='allowed_type'>{t('allowedFileType')}</span>
          </>
        )
      case 'dropdown':
        return (
          <div className="cat_select_wrapper">
            <select {...inputProps} required className='userVerInputs bg extra_det_select'>
              <option value="">{t('select')} {name}</option>
              {values?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            <FaAngleDown className='cat_select_arrow' />
          </div>
        );
      case 'checkbox':

        return (
          <div className='date_posted_checkbox extradet_checkbox'>
            {values?.map((value, index) => (
              <Checkbox
                key={`${index}-${value}`}
                value={value}
                checked={Details[id]?.includes(value)}
                onChange={(e) => handleCheckboxChange(id, e.target.value, e.target.checked)}
              >
                {value}
              </Checkbox>
            ))}
          </div>
        );
      case 'radio':

        return (
          <Radio.Group {...inputProps} className='radio_group extradet_radio_group' onChange={(e) => handleChange(id, e.target.value)}>
            {values?.map((option, index) => (
              <Radio key={index} value={option}>{option}</Radio>
            ))}
          </Radio.Group>
        );
      default:
        return null;
    }
  };

  const handleChange = (id, value) => {
    setDetails((prevDetails) => ({ ...prevDetails, [id]: value !== null ? value : '' }));
  };

  const handleCheckboxChange = (id, value, checked) => {
    setDetails((prevDetails) => {
      const newValue = checked
        ? [...(prevDetails[id] || []), value]
        : (prevDetails[id] || []).filter((v) => v !== value);
      return { ...prevDetails, [id]: newValue };
    });
  };

  const handleFileChange = (id, file) => {
    if (file) {
      const allowedExtensions = /\.(jpg|jpeg|svg|png|pdf)$/i;
      if (!allowedExtensions.test(file.name)) {
        toast.error(t('notAllowedFile'));
        return;
      }
      const fileUrl = URL.createObjectURL(file);
      setFilePreviews(prevPreviews => ({
        ...prevPreviews,
        [id]: {
          url: fileUrl,
          isPdf: /\.pdf$/i.test(file.name)
        }
      }));
      setDetails((prevDetails) => ({
        ...prevDetails,
        [id]: file
      }));
    }
  };


  const handleKeyDown = (e, maxLength) => {

    if (maxLength === null || maxLength === undefined) {
      return
    }
    const value = e.target.value;
    // Allow control keys (Backspace, Delete, Arrow keys, etc.)
    const controlKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Tab',
    ];

    if (
      value.length >= maxLength &&
      !controlKeys.includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  function inpNum(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9]+$/)) {
      e.preventDefault();
    }
  }


  const validateExtraDetails = () => {
    for (const field of UserVeriFields) {

      const { name, type, id, min_length, is_required } = field;

      if (is_required === 1) {
        if (type !== 'checkbox' && type !== 'fileinput' && !(type === 'textbox' ? Details[id]?.trim() : Details[id])) {
          toast.error(`${t('fillDetails')} ${name}.`);
          return false;
        }

        if (type === 'fileinput' && !filePreviews[id]) {
          toast.error(`${t('fillDetails')} ${name}.`);
          return
        }

        if ((type === 'checkbox') && Details[id]?.length === 0) {
          toast.error(`${t('selectAtleastOne')} ${name}.`);
          return false;
        }

        // Required field with min_length validation
        if (Details[id] && type === 'textbox' && Details[id].trim().length < min_length) {
          toast.error(`${name} ${t('mustBeAtleast')} ${min_length} ${t('charactersLong')}`);
          return false;
        }
        if (Details[id] && type === 'number' && Details[id].length < min_length) {
          toast.error(`${name} ${t('mustBeAtleast')} ${min_length} ${t('digitLong')}`);
          return false;
        }
      }

      if (is_required === 0 && Details[id] && type === 'textbox' && Details[id].length < min_length) {
        toast.error(`${name} ${t('mustBeAtleast')} ${min_length} ${t('charactersLong')}`);
        return false;
      }

      if (is_required === 0 && Details[id] && type === 'number' && Details[id].length < min_length) {
        toast.error(`${name} ${t('mustBeAtleast')} ${min_length} ${t('digitLong')}`);
        return false;
      }


    }
    return true;
  };

  const handleVerify = async () => {

    if (VerificationStatus === 'approved') {
      toast.error(t('verificationDoneAlready'))
      return
    }
    if (VerificationStatus === 'resubmitted' || VerificationStatus === 'pending' || VerificationStatus === 'submitted') {
      toast.error(t('verificationAlreadyInReview'))
      return
    }

    if (validateExtraDetails()) {
      try {
        const res = await sendVerificationReqApi.sendVerificationReq({ Details });
        if (res?.data?.error === false) {
          toast.success(res?.data?.message)
          router.push('/profile/edit-profile')
        }
      } catch (error) {
        console.log(error);
      }
    }
  };



  return (
    <>
      <BreadcrumbComponent title2={t('userVerification')} />
      <div className="container">
        <div className="row my_prop_title_spacing">
          <h4 className="pop_cat_head">{t('userVerification')}</h4>
        </div>
        <div className="row gy-4">




          {
            UserVeriFields?.map((field) => (
              <div className="col-12 col-lg-6" key={field?.id}>
                <div className="contentWrapper">
                  <label className={`${field?.is_required ? 'auth_label' : 'auth_pers_label'}`} htmlFor={field?.id}>{field?.name}</label>
                  {renderInputField(field)}
                </div>
              </div>
            ))
          }
          <div className="col-12">
            <div className="verifyBtnWrap">
              <button type='button' className='verfiyBtn' onClick={handleVerify}>{t('verify')}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserVerification