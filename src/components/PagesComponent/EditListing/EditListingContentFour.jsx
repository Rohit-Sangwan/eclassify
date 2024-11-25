'use client'
import { placeholderImage, t } from '@/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { MdClose } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { HiOutlineUpload } from "react-icons/hi";
import toast from 'react-hot-toast';

const ContentFour = ({ uploadedImages, setUploadedImages, OtherImages, setOtherImages, handleImageSubmit, handleGoBack, setDeleteImagesId }) => {

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length == 0) {
            toast.error(t("wrongFile"))
        } else {
            setUploadedImages((prevImages) => [...prevImages, ...acceptedFiles]);
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        },
        multiple: false,
        maxSize: 3145728
    });

    const removeImage = (index) => {
        if (typeof uploadedImages === 'string') {
            setUploadedImages([])
        } else {
            setUploadedImages((prevImages) => prevImages?.filter((_, i) => i !== index));
        }
    };

    const files = useMemo(
        () => {
            if (typeof uploadedImages === 'string') {
                return (
                    <div className="dropbox_img_div">
                        <img className="dropbox_img" src={uploadedImages} alt="Uploaded Image" />
                        <div className="dropbox_d">
                            <button className="close_icon_cont img_upl_close" onClick={() => removeImage(0)}>
                                <MdClose size={14} color="black" className='upd_img_rem_icon' />
                            </button>
                            <div className="dropbox_img_deatils">
                                <span>{t('uploadedImage')}</span>
                                {/* You can add additional details here if needed */}
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    uploadedImages?.map((file, index) => (
                        <div div key={index} className="dropbox_img_div" >
                            <img className="dropbox_img" src={URL.createObjectURL(file)} alt={file.name} />
                            <div className="dropbox_d">
                                <button className="close_icon_cont img_upl_close" onClick={() => removeImage(index)}>
                                    <MdClose size={14} color="black" className='upd_img_rem_icon' />
                                </button>
                                <div className="dropbox_img_deatils">
                                    <span>{file.name}</span>
                                    <span>{Math.round(file.size / 1024)} KB</span>
                                </div>
                            </div>
                        </div >
                    ))
                ) || []
            }
        },
        [uploadedImages]
    );

    const onOtherDrop = useCallback((acceptedFiles) => {
        setOtherImages((prevImages) => [...prevImages, ...acceptedFiles]);
    }, [OtherImages])

    const { getRootProps: getRootOtheProps, getInputProps: getInputOtherProps, isDragActive: isDragOtherActive } = useDropzone({
        maxFiles: 5,
        onDrop: onOtherDrop,
        disabled: OtherImages?.length >= 5 ? true : false,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        },
        multiple: true
    });


    const removeOtherImage = (index, file) => {
        setOtherImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setDeleteImagesId((prevIds) => {
            const newId = file?.id;
            if (prevIds) {
                return `${prevIds},${newId}`;
            } else {
                return `${newId}`;
            }
        });
    };

    const filesOther = useMemo(
        () =>
            OtherImages && OtherImages?.map((file, index) => (
                <div key={index} className="dropbox_img_div multiple_images">
                    <img className="dropbox_img" src={file.image ? file.image : URL.createObjectURL(file)} alt={file.name} />
                    <div className="dropbox_d">

                        <button className="close_icon_cont img_upl_close" onClick={() => removeOtherImage(index, file)}>
                            <MdClose size={14} color="black" className='upd_img_rem_icon' />
                        </button>
                        <div className="dropbox_img_deatils">
                            <span>{file.name}</span>
                            <span>{Math.round(file.size / 1024)} KB</span>
                        </div>
                    </div>
                </div>
            )),
        [OtherImages]
    );



    return (
        <>
            {/* main image upload  */}
            <div className="col-lg-6">
                <div>
                    <div className='picHeadDiv'>
                        <span className='picHeadline'>{t('mainPicture')}</span>
                        <span><MdInfoOutline /></span>
                    </div>
                    <div className="image-upload">


                        <div className="dropbox">
                            <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
                                <input {...getInputProps()} />
                                {uploadedImages.length === 0 ? (
                                    isDragActive ? (
                                        <span>{t("dropFiles")}</span>
                                    ) : (
                                        <span className='img_text_wrap'>
                                            <span>
                                                {t("dragFiles")}
                                            </span>
                                            <span className='or'>{t('or')}</span>
                                            <span className='upld_icon_text'>
                                                <HiOutlineUpload size={24} color='#00B2CA' />
                                                <span className='imgUpload_text'>{t('upload')}</span>
                                            </span>

                                        </span>

                                    )
                                ) : null}
                            </div>
                            <div>{files}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6">
                <div>
                    <div className='picHeadDiv'>
                        <span className='picHeadline'>{t('otherPicture')}</span>
                        <span><MdInfoOutline /></span>
                    </div>
                    <div className="image-upload">


                        <div className="dropbox">
                            <div {...getRootOtheProps()} className={`dropzone ${isDragOtherActive ? "active" : ""}`}>
                                <input {...getInputOtherProps()} />
                                {isDragOtherActive ? (
                                    <span>{t("dropFiles")}</span>
                                ) : (
                                    <span className='img_text_wrap'>
                                        <span>{t("dragFiles")}</span>
                                        <span className='or'>{t('or')}</span>
                                        <span className='upld_icon_text'>
                                            <HiOutlineUpload size={24} color='#00B2CA' />
                                            <span className='imgUpload_text'>{t('upload')}</span>
                                        </span>
                                    </span>
                                )}
                            </div>
                            <div>{filesOther}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="formBtns">
                    <button className='backBtn' onClick={handleGoBack}>{t('back')}</button>
                    <button className='nextBtn' onClick={handleImageSubmit}>{t('next')}</button>
                </div>
            </div>
        </>
    )
}

export default ContentFour;
