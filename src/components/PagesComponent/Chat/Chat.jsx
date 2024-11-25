'use client'
import { useEffect, useState } from 'react';
import UserBuyerChatTab from "@/components/Profile/UserBuyerChatTab";
import Image from "next/image";
import { IoCloseCircleOutline, IoGiftOutline } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import { BiSend } from "react-icons/bi";
import { isLogin, placeholderImage, t } from "@/utils";
import { addItemReviewApi, blockUserApi, chatListApi, getBlockedUsers, getMessagesApi, itemOfferApi, sendMessageApi, unBlockUserApi } from '@/utils/api';
import UserSellerChatTab from '@/components/Profile/UserSellerChatTab';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import NoData from '@/components/NoDataFound/NoDataFound';
import { RiUserForbidLine } from 'react-icons/ri';
import NoChatFound from '@/components/NoDataFound/NoChatFound';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Popover, Rate } from 'antd';
import ImageViewer from './ImageViewer';
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';
import { getGlobalStateData, loadChatAudio } from '@/redux/reuducer/globalStateSlice';
import BreadcrumbComponent from '@/components/Breadcrumb/BreadcrumbComponent';
import Skeleton from 'react-loading-skeleton';
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
import NoConvWithSeller from './NoConvWithSeller';
import MakeOfferInChat from './MakeOfferInChat';


const Chat = ({ notificationData }) => {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state) => state.UserSignup);
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const ChatOfferData = useSelector((state) => state?.OfferData)
    const systemSettingsData = useSelector((state) => state?.Settings)
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol
    const defaultSelected = ChatOfferData?.data ? ChatOfferData?.data : "";
    const defaultSelectedChat = ChatOfferData?.chatOffer ? ChatOfferData?.chatOffer : "";
    const userCurrentId = isLoggedIn && isLoggedIn.data ? isLoggedIn.data.data.id : null;
    const [activeTab, setActiveTab] = useState('buying'); // State to manage active tab
    const [sellerChatList, setSellerChatList] = useState([]);
    const [buyerChatList, setBuyerChatList] = useState([]);
    const [selectedTabData, setSelectedTabData] = useState(defaultSelected ? defaultSelected : null); // State to store selected chat ID
    const [isUserOffer, setIsUSerOffer] = useState(false); // State to store selected chat ID
    const [chatMessages, setChatMessages] = useState([]); // State to store selected chat ID
    const [messageInput, setMessageInput] = useState(''); // State to store text message
    const [selectedFile, setSelectedFile] = useState(null); // State to store selected file
    const [selectedAudio, setSelectedAudio] = useState(null); // State to store selected audio
    const [selectedFilePreview, setSelectedFilePreview] = useState(null);
    const [recording, setRecording] = useState(false); // State to track recording status
    const [audioChunks, setAudioChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false); // State to hold
    const [popoverVisible, setPopoverVisible] = useState(false); // State to control popover visibility
    const [blockPopoverVisible, setBlockPopoverVisible] = useState(false); // State to control popover visibility
    const [blockedUsersList, setBlockedUsersList] = useState([]); // State to control popover visibility
    const [viewerImage, setViewerImage] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [Rating, setRating] = useState('')
    const [IsTopMakeOffer, setIsTopMakeOffer] = useState(true)
    const [IsMakeOfferInChat, setIsMakeOfferInChat] = useState(false)
    const [OfferPrice, setOfferPrice] = useState('')
    const [Review, setReview] = useState('')

    const makeUnableToChat = selectedTabData?.item?.status === "review" || selectedTabData?.item?.status === "rejected" || selectedTabData?.item?.status === "sold out" || selectedTabData?.item?.status === "inactive"

    const IsShowRating = activeTab === 'buying' && makeUnableToChat

    const handleActiveTab = (type) => {
        setActiveTab(type)
        setSelectedTabData(null)
    }

    useEffect(() => {
        if (activeTab === "buying") {
            setIsUSerOffer(true)
        } else {
            setIsUSerOffer(false)
        }
    }, [activeTab]);

    useEffect(() => {
        if (notificationData) {
            const newMessage = {
                message_type: notificationData.type,
                message: notificationData.message,
                sender_id: notificationData.sender_id,
                created_at: notificationData.created_at,
                audio: notificationData.audio,
                file: notificationData.file,
            };
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    }, [notificationData]);


    const fetchBuyerChatList = async () => {
        setIsLoading(true)
        try {
            const response = await chatListApi.chatList({ type: "buyer" });
            const { data } = response?.data || {};
            setBuyerChatList(data || []);

            // Check if selectedTabData is present in the fetched buyer chat list
            if (selectedTabData && Array.isArray(data?.data)) {
                const selectedChatData = data?.data.find(chat => chat.id === selectedTabData.id);
                setSelectedTabData(selectedChatData)
                if (selectedChatData && !selectedChatData.user_blocked) {
                    setIsBlocked(false);
                }
            }
            setIsLoading(false)

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    };


    const fetchSellerChatList = async () => {
        setIsLoading(true)
        try {
            const response = await chatListApi.chatList({ type: "seller" });
            const { data } = response?.data || {};
            setSellerChatList(data || []);
            setIsLoading(false)

        } catch (error) {
            console.log("Error fetching seller chat list:", error);
            setIsLoading(false)
        }
    };
    const fetchChatMessgaes = async (id) => {
        try {
            const response = await getMessagesApi.chatMessages({ item_offer_id: id });
            const { data } = response.data;
            setChatMessages(data?.data);
            setOfferPrice('')
            setRating('')
        } catch (error) {
            console.log(error);
        }
    };

    // Function to fetch blocked users
    const fetchBlockedUsers = async () => {
        try {
            const response = await getBlockedUsers.blockedUsers({});
            const { data } = response;
            setBlockedUsersList(data?.data);

        } catch (error) {
            console.error('Error fetching blocked users:', error);
        }
    };

    useEffect(() => {
        if (blockPopoverVisible) {
            fetchBlockedUsers();
        }
    }, [blockPopoverVisible]);


    useEffect(() => {
        if (isLogin()) {
            if (activeTab === "buying") {
                fetchBuyerChatList();
            } else {
                fetchSellerChatList();
            }
        }
    }, [activeTab, isBlocked]);

    useEffect(() => {
        if (selectedTabData) {
            fetchChatMessgaes(selectedTabData?.id);
        }
    }, [selectedTabData]);


    const handleChatTabClick = (chatData) => {
        if (chatData) {
            setSelectedTabData(chatData);
            setIsBlocked(false)
        }
    };

    useEffect(() => {
        if (selectedTabData?.user_blocked === true) {
            setIsBlocked(true)
        } else {
            setIsBlocked(false)
        }
    }, [selectedTabData])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (validTypes.includes(file.type)) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSelectedFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                // Reset the input field
                e.target.value = null;
                setSelectedFilePreview(null);
                // Show an error message
                toast.error(t('selectValidImage'));
            }
        } else {
            // Reset the input field
            e.target.value = null;
            setSelectedFilePreview(null);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };
    const formatMessageDate = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return t('today');
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return t('yesterday');
        } else {
            return messageDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    };


    // Register the extendable-media-recorder-wav-encoder
    const connectAudio = async () => {
        try {
            if (!MediaRecorder.isTypeSupported('audio/wav')) {
                await register(await connect());
            }
        } catch (error) {
            console.error('Error connecting audio:', error);
            // Handle the error appropriately
        }
    };
    useEffect(() => {
        connectAudio();
    }, []);
    const globalData = useSelector(getGlobalStateData)
    const recordedAudio = globalData?.chatState?.chatAudio?.data
    const startRecording = async () => {
        // Init

        loadChatAudio({})
        // Check if any audio input devices are available
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const hasAudioInput = devices.some(device => device.kind === 'audioinput');
                if (!hasAudioInput) {
                    handleNoMicrophoneError();
                    return;
                }
                // Request microphone access
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                    }
                })
                    .then(stream => {
                        const mediaRecorderInstance = new MediaRecorder(stream, {
                            mimeType: 'audio/wav'
                        });
                        mediaRecorderInstance.ondataavailable = (e) => {
                            dispatch(loadChatAudio({ data: e.data }));
                        };
                        mediaRecorderInstance.start();
                        setMediaRecorder(mediaRecorderInstance);
                        setRecording(true);
                    })
                    .catch(handleMicrophoneError);

            })
            .catch(err => {
                console.error('Error enumerating devices:', err);
                handleGenericError();
            });
    };


    const createWavFile = (audioBlob) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const audioData = event.target.result;
                const wavBlob = new Blob([audioData], { type: 'audio/x-wav' });
                resolve(wavBlob);
            };
            reader.readAsArrayBuffer(audioBlob);
        });
    };

    const stopRecording = () => {
        setRecording(false);
        if (mediaRecorder) {
            mediaRecorder.onstop = async () => {
                const mimeType = mediaRecorder.mimeType;
                const audioBlob = new Blob(Array.isArray(recordedAudio) ? recordedAudio : [recordedAudio], { type: mimeType });
                try {
                    // Create WAV file from the audio blob
                    const wavBlob = await createWavFile(audioBlob);

                    // Create a unique filename with .wav extension
                    const fileName = `recording_${Date.now()}.wav`;

                    // Create a File object from the Blob
                    const audioFile = new File([wavBlob], fileName, { type: 'audio/x-wav' });

                    // Set the audio file to the state
                } catch (error) {
                    console.error("Error processing audio:", error);
                }

            };
            mediaRecorder.stop();
        }
    };

    useEffect(() => {

    }, [recordedAudio])

    const handleNoMicrophoneError = () => {
        Swal.fire({
            title: t('noMicrophone'),
            text: t('connectMircophone'),
            icon: 'warning',
            confirmButtonText: t('ok'),
        });
    };

    const handleMicrophoneError = (err) => {
        console.error('Error accessing microphone:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            Swal.fire({
                title: t('permissionDenied'),
                text: t('allowAccess'),
                icon: 'error',
                confirmButtonText: t('ok'),
            });
        } else {
            handleGenericError();
        }
    };

    const handleGenericError = () => {
        Swal.fire({
            title: t('error'),
            text: t('errorAccessingMicrophone'),
            icon: 'error',
            confirmButtonText: t('ok'),
        });
    };

    useEffect(() => {
    }, [chatMessages, selectedFilePreview, selectedTabData, blockedUsersList, audioChunks]);

    const handleBlockUser = async (id) => {
        try {
            const response = await blockUserApi.blockUser({ blocked_user_id: id });
            toast.success(response?.data?.message);
            setIsBlocked(true);
            setSelectedTabData((prevData) => ({
                ...prevData,
                user_blocked: true
            }));
            fetchBlockedUsers();
            setPopoverVisible(false);
        } catch (error) {
            setIsBlocked(false);
            console.log(error);
        }
    };

    const handleUnBlockUser = async (id) => {
        try {
            const response = await unBlockUserApi.unBlockUser({ blocked_user_id: id });
            toast.success(response?.data?.message);
            setIsBlocked(false);
            setSelectedTabData((prevData) => ({
                ...prevData,
                user_blocked: false
            }));
            fetchBlockedUsers();
            setPopoverVisible(false);
            setBlockedUsersList(prevUsers => prevUsers.filter(user => user.id !== id));
            // Fetch the updated chat list after unblocking
            if (activeTab === 'buying') {
                fetchBuyerChatList();
            } else {
                fetchSellerChatList();
            }
            setBlockPopoverVisible(false)
        } catch (error) {
            setIsBlocked(true);
            console.log(error);
        }
    };

    const content = (userId) => (
        <div>
            {isBlocked ? (
                <p onClick={() => handleUnBlockUser(userId)} style={{ cursor: 'pointer' }}>
                    {t("unblock")}
                </p>
            ) : (
                <p onClick={() => handleBlockUser(userId)} style={{ cursor: 'pointer' }}>
                    {t("block")}
                </p>
            )}
        </div>
    );

    const popoverContent = (
        <div className="blocked-users-popover">
            {blockedUsersList.length > 0 ? (
                blockedUsersList.map(user => (
                    <div key={user.id} className="blocked-user">
                        <div className="user-info">
                            <div className="user-image">
                                <Image src={user?.profile || systemSettingsData?.data?.data?.placeholder_image} alt="User" width={40} height={40} onErrorCapture={placeholderImage} />
                            </div>
                            <div className="user-details">
                                <p className="user-name">{user.name}</p>
                            </div>
                        </div>
                        {/* Unblock button */}
                        <button onClick={() => handleUnBlockUser(user.id)} className="unblock-button">{t("unblock")}</button>
                    </div>
                ))
            ) : (
                <p>{t("nousers")}</p>
            )}
        </div>
    );
    const openImageViewer = (imageSrc) => {
        setViewerImage(imageSrc);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default behavior (new line)
            sendMessage();
        }
    };
    const sendMessage = async () => {

        setIsSending(true);
        try {
            const response = await sendMessageApi.sendMessage({
                item_offer_id: selectedTabData?.id,
                message: messageInput ? messageInput : "",
                file: selectedFile ? selectedFile : "",
                audio: selectedAudio ? selectedAudio : ""
            });
            const { data } = response.data;
            if (response?.data?.error === false) {
                fetchChatMessgaes(selectedTabData?.id);
                setMessageInput('');
                setSelectedFile(null);
                setSelectedAudio(null);
                setAudioChunks(null);
                setSelectedFilePreview(null);
            } else {
                toast.error(response?.data?.message)
            }
        } catch (error) {
            console.log(error);

        } finally {
            setIsSending(false);
        }
    };

    const handleRatingChange = (value) => {
        setRating(value)
    }

    const handleMakeOfferInStart = () => {
        setIsMakeOfferInChat(true)
    }


    const handleOfferLaterClick = () => {
        setIsMakeOfferInChat(false)

        if (chatMessages?.length > 0 && !selectedTabData?.amount) {
            setIsTopMakeOffer(true)
        }
    }

    const handleTopMakeOfferClick = () => {
        setIsTopMakeOffer(false)
        setIsMakeOfferInChat(true)
    }

    const handleSendOffer = async () => {
        // Ensure the offer price is a valid number
        const offerAmount = parseFloat(OfferPrice);

        if (isNaN(offerAmount) || offerAmount <= 0) {
            toast.error(t('offerPricePositiveError')); // Set an error message if the offer price is not valid
            return;
        }

        if (offerAmount > selectedTabData?.item?.price) {
            toast.error(t('offerPriceError')); // Set an error message if the offer price is too high
            return;
        }

        try {
            const response = await itemOfferApi.offer({
                item_id: Number(selectedTabData.item_id),
                amount: offerAmount
            });
            const { data } = response.data;

            if (response?.data?.error === false) {
                toast.success(response?.data?.message);
                setIsMakeOfferInChat(false)
            }
            setSelectedTabData(data);
            setIsUSerOffer(true)

        } catch (error) {
            console.log(error);
            toast.error(t('offerSendError')); // Handle error during offer sending
        }
    };

    const handleReviewSubmit = async () => {
        if (Rating === '') {
            toast.error(t('provideRating'))
            return
        }
        if (Review.trim() === '') {
            toast.error(t('provideReview'))
            return
        }
        try {
            const res = await addItemReviewApi.addItemReview({ item_id: selectedTabData?.item_id, review: Review, ratings: Rating })
            if (res?.data?.error === false) {
                toast.success(res?.data?.message)

                setSelectedTabData((prev) => ({
                    ...prev,
                    item: {
                        ...prev.item,
                        review: res?.data?.data,
                    },
                }));

                setBuyerChatList((prev) => ({
                    ...prev,
                    data: prev?.data?.map(chatItem =>
                        chatItem?.item?.id === Number(res?.data?.data?.item_id) // Match item_id correctly
                            ? {
                                ...chatItem,
                                item: {
                                    ...chatItem.item, // Preserve the other properties of the item
                                    review: res?.data?.data?.review // Set review from the response
                                }
                            }
                            : chatItem
                    ),
                }));

            }
            else {
                toast.error(t('failedToSubmitReview'))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleReviewChange = (e) => {
        setReview(e.target.value)
    }

    return (
        <>
            <BreadcrumbComponent title2={t('chat')} />

            <div className='container'>
                <div className="row my_prop_title_spacing">
                    <h4 className="pop_cat_head">{t('chat')}</h4>
                </div>
                <div className="row profile_sidebar">
                    <ProfileSidebar />
                    <div className="col-lg-9 p-0">
                        <div className="container">
                            {isLoading ? (
                                <div className="row">
                                    <div className="col-lg-4 " >
                                        <div className="chat_dashboard">
                                            <div className="chat_search_wrap">
                                                <span>{t("chat")}</span>
                                            </div>
                                            <div className="chat_header">
                                                <span
                                                    className={`chat_tab ${activeTab === 'buying' ? 'active_chat_tab' : ''}`}
                                                    onClick={() => handleActiveTab('buying')}
                                                >
                                                    {t('buying')}
                                                </span>
                                                <span
                                                    className={`chat_tab ${activeTab === 'selling' ? 'active_chat_tab' : ''}`}
                                                    onClick={() => handleActiveTab('selling')}
                                                >
                                                    {t('selling')}
                                                </span>
                                            </div>
                                            <div className="chat_list">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <div className="chat_user_tab_wrapper">
                                                        <div className="chat_user_tab">
                                                            <div className="user_name_img">
                                                                <div className="user_chat_tab_img_cont">
                                                                    <Skeleton circle={true} height={56} width={56} className='user_chat_tab_img' />
                                                                    <Skeleton circle={true} height={24} width={24} style={{ border: "1px solid lightgray" }} className='user_chat_small_img' />
                                                                </div>
                                                                <div className="user_det">
                                                                    <Skeleton width={40} height={20} />
                                                                    <Skeleton width={100} height={20} />
                                                                </div>
                                                            </div>
                                                            <p className="user_chat_tab_time">
                                                                <Skeleton width={50} />
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8 p-0">
                                        <Skeleton height="550px" />
                                    </div>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col-lg-4 p-0">
                                        <div className="chat_dashboard">
                                            <div className="chat_search_wrap">
                                                <span>{t("chat")}</span>
                                                <div className='blockList'>

                                                    <Popover
                                                        content={popoverContent}
                                                        title="Blocked Users"
                                                        visible={blockPopoverVisible}
                                                        onVisibleChange={setBlockPopoverVisible}
                                                        placement="bottom"
                                                        trigger="click"
                                                        className='blocklist'>
                                                        <button>
                                                            <RiUserForbidLine size={22} />
                                                        </button>
                                                    </Popover>
                                                </div>
                                            </div>
                                            <div className="chat_header">
                                                <span
                                                    className={`chat_tab ${activeTab === 'buying' ? 'active_chat_tab' : ''}`}
                                                    onClick={() => handleActiveTab('buying')}
                                                >
                                                    {t('buying')}
                                                </span>
                                                <span
                                                    className={`chat_tab ${activeTab === 'selling' ? 'active_chat_tab' : ''}`}
                                                    onClick={() => handleActiveTab('selling')}
                                                >
                                                    {t('selling')}
                                                </span>
                                            </div>
                                            <div className="chat_list">
                                                {activeTab === 'buying' ? (
                                                    <>
                                                        {buyerChatList && buyerChatList?.data?.length > 0 ? (
                                                            buyerChatList && buyerChatList?.data?.map((chat, index) => (
                                                                <UserBuyerChatTab
                                                                    key={index}
                                                                    isActive={chat?.id === selectedTabData?.id}
                                                                    chat={chat}
                                                                    handleChatTabClick={handleChatTabClick}
                                                                />
                                                            ))
                                                        ) : (
                                                            <div>
                                                                <NoData />
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {sellerChatList && sellerChatList?.data && sellerChatList?.data?.length > 0 ? (
                                                            sellerChatList?.data?.map((chat, index) => (
                                                                <UserSellerChatTab
                                                                    key={index}
                                                                    isActive={chat?.id === selectedTabData?.id}
                                                                    chat={chat}
                                                                    handleChatTabClick={handleChatTabClick}
                                                                />

                                                            ))
                                                        ) : (
                                                            <div className='no_data_conatiner'>
                                                                <NoData />
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8 p-0">
                                        {!selectedTabData || selectedTabData?.length <= 0 ? (
                                            <>

                                                {/* <div className='chatNoData_space'> */}
                                                <NoChatFound />
                                                {/* </div> */}
                                            </>
                                        ) : (
                                            <div className="chat">
                                                <div className="chat_active_chat_user">
                                                    {activeTab === 'buying' ? (
                                                        <div className="chat_user_tab">
                                                            <div className="user_name_img">
                                                                <div className="user_chat_tab_img_cont">
                                                                    <Image src={selectedTabData?.seller?.profile ? selectedTabData?.seller?.profile : systemSettingsData?.data?.data?.placeholder_image} alt="User" width={56} height={56} className="user_chat_tab_img" onErrorCapture={placeholderImage} />
                                                                    <Image src={selectedTabData?.item?.image ? selectedTabData?.item?.image : systemSettingsData?.data?.data?.placeholder_image} alt="User" width={24} height={24} className="user_chat_small_img" onErrorCapture={placeholderImage} />
                                                                </div>
                                                                <div className="user_det">
                                                                    <h6>{selectedTabData?.seller?.name}</h6>
                                                                    <p>{selectedTabData?.item?.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="actual_price">
                                                                <Popover content={content(selectedTabData?.seller?.id)} trigger="click" placement="bottom" visible={popoverVisible} onVisibleChange={setPopoverVisible}>
                                                                    <span style={{ cursor: 'pointer' }}>
                                                                        <HiOutlineDotsVertical size={22} />
                                                                    </span>
                                                                </Popover>
                                                                <p className="user_chat_tab_time user_chat_money">{CurrencySymbol}{selectedTabData?.item?.price}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="chat_user_tab">
                                                            <div className="user_name_img">
                                                                <div className="user_chat_tab_img_cont">
                                                                    <Image src={selectedTabData?.buyer?.profile ? selectedTabData?.buyer?.profile : systemSettingsData?.data?.data?.placeholder_image} alt="User" width={56} height={56} className="user_chat_tab_img" onErrorCapture={placeholderImage} />
                                                                    <Image src={selectedTabData?.item?.image ? selectedTabData?.item?.image : systemSettingsData?.data?.data?.placeholder_image} alt="User" width={24} height={24} className="user_chat_small_img" onErrorCapture={placeholderImage} />
                                                                </div>
                                                                <div className="user_det">
                                                                    <h6>{selectedTabData?.buyer?.name}</h6>
                                                                    <p>{selectedTabData?.item?.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="actual_price">
                                                                <Popover content={content(selectedTabData?.buyer?.id)} trigger="click" placement="bottom" visible={popoverVisible} onVisibleChange={setPopoverVisible}>
                                                                    <span style={{ cursor: 'pointer' }}>
                                                                        <HiOutlineDotsVertical size={22} />
                                                                    </span>
                                                                </Popover>
                                                                <p className="user_chat_tab_time user_chat_money">{CurrencySymbol}{selectedTabData?.item?.price}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>


                                                <div className='chatRatingWrap'>

                                                    {
                                                        IsTopMakeOffer && chatMessages?.length > 0 && !selectedTabData?.amount && !makeUnableToChat && activeTab === 'buying' &&
                                                        <div className='topMakeOffer'>
                                                            <h1 className='submitProposal'>{t('submitProposal')}</h1>
                                                            <button className="makeOfferCont" onClick={handleTopMakeOfferClick}>
                                                                <span><IoGiftOutline size={20} /></span>
                                                                <span>{t('makeOffer')}</span>
                                                            </button>
                                                        </div>
                                                    }

                                                    <div className="chat_wrapper">
                                                        <>
                                                            {
                                                                chatMessages?.length === 0 && !selectedTabData?.amount && !IsMakeOfferInChat && activeTab === 'buying' && !makeUnableToChat &&
                                                                <NoConvWithSeller handleMakeOfferInStart={handleMakeOfferInStart} />
                                                            }


                                                            {
                                                                selectedTabData?.amount &&
                                                                <div className={`${isUserOffer ? "sender_offerprice" : "receiver_offerprice"}`}>
                                                                    <div className="chat_time_cont">
                                                                        <div className="sender_text_cont">
                                                                            {isUserOffer ? (
                                                                                <p className="youroffer">{t('yourOffer')}</p>
                                                                            ) : (
                                                                                <p className="youroffer">{t('offer')}</p>
                                                                            )}
                                                                            <h5>{CurrencySymbol}{selectedTabData?.amount}</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }

                                                            {
                                                                chatMessages?.length > 0 &&
                                                                <div className='render_messages'>
                                                                    {chatMessages && Object.entries(
                                                                        chatMessages.reduce((acc, message) => {
                                                                            const date = formatMessageDate(message.created_at);
                                                                            if (!acc[date]) acc[date] = [];
                                                                            acc[date].push(message);
                                                                            return acc;
                                                                        }, {})
                                                                    ).map(([date, messages], dateIndex) => (
                                                                        <div key={`date-group-${dateIndex}`} className="date-message-group">
                                                                            <div className="date-separator">
                                                                                <span>{date}</span>
                                                                            </div>
                                                                            <div className="chat_render_msgs">
                                                                                {messages.map((message, messageIndex) => (
                                                                                    <div key={`message-${dateIndex}-${messageIndex}`}>
                                                                                        {message.message_type === "text" && (
                                                                                            <div className={`${message.sender_id === userCurrentId ? "sender_message" : "other_message"}`}>
                                                                                                <p className="sender_single_text_cont">
                                                                                                    {message?.message}
                                                                                                </p>
                                                                                                <p className="chat_time">{formatTime(message?.created_at)}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {message.message_type === "file" && (
                                                                                            <div className={`${message.sender_id === userCurrentId ? "sender_message" : "other_message"}`}>
                                                                                                <div className="file_img" onClick={() => openImageViewer(message?.file)}>
                                                                                                    <Image src={message?.file ? message?.file : systemSettingsData?.data?.data?.placeholder_image} width={0} height={0} alt='file' className='chat_file_img' loading='lazy' onErrorCapture={placeholderImage} />
                                                                                                </div>
                                                                                                <p className="chat_time">{formatTime(message?.created_at)}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {message.message_type === "audio" && (
                                                                                            <div className={`${message.sender_id === userCurrentId ? "sender_message" : "other_message"}`}>
                                                                                                <div className="chat_audio">
                                                                                                    <audio controls>
                                                                                                        <source src={message?.audio} type="audio/mpeg" />
                                                                                                        {t('browserDoesNotSupportAudio')}
                                                                                                    </audio>
                                                                                                </div>
                                                                                                <p className="chat_time">{formatTime(message?.created_at)}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {message.message_type === "file_and_text" && (
                                                                                            <div className={`${message.sender_id === userCurrentId ? "sender_message" : "other_message"}`}>
                                                                                                <div className="file_text">
                                                                                                    <div className="text_file_img" onClick={() => openImageViewer(message?.file)}>
                                                                                                        <Image src={message?.file ? message?.file : systemSettingsData?.data?.data?.placeholder_image} width={0} height={0} alt='file' className='chat_file_img' loading='lazy' onErrorCapture={placeholderImage} />
                                                                                                        <div className="text">
                                                                                                            <span>{message.message}</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <p className="chat_time">{formatTime(message?.created_at)}</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }

                                                        </>
                                                    </div>
                                                    {
                                                        IsMakeOfferInChat && activeTab === 'buying' && !selectedTabData?.amount && !makeUnableToChat &&
                                                        <MakeOfferInChat handleOfferLaterClick={handleOfferLaterClick} OfferPrice={OfferPrice} setOfferPrice={setOfferPrice} handleSendOffer={handleSendOffer} />
                                                    }

                                                    {
                                                        IsShowRating && !selectedTabData?.item?.review &&
                                                        <div className='rateSellerWrap'>
                                                            <div className='rateSellerCont'>
                                                                <h6 className='rateSellerHeading'>{t('rateSeller')}</h6>
                                                                <div className="rateExpCont">
                                                                    <p className='rateYourExp'>{t('rateYourExp')}</p>
                                                                    <Rate defaultValue={0} className='ratingStars' onChange={handleRatingChange} />
                                                                    <textarea value={Review} onChange={handleReviewChange} className='auth_input no-resize' id="" cols="30" rows="5" placeholder={t('writeReview')}></textarea>
                                                                    <button className='reviewSubmitBtn' onClick={handleReviewSubmit}>{t('submit')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div>
                                                    {makeUnableToChat ? (
                                                        <div className='itemStatus'>
                                                            <p>{t("thisitem")} {selectedTabData?.item?.status}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="chat_input_cont" style={{ padding: isBlocked ? "0px" : "16px" }}>
                                                            <input
                                                                type="file"
                                                                id="file_attach"
                                                                className="chat_file_input"
                                                                onChange={handleFileChange}
                                                                accept="image/jpeg,image/png,image/jpg"
                                                                style={{ display: 'none' }}
                                                                disabled={IsShowRating}
                                                            />
                                                            {selectedFilePreview && (
                                                                <div className="file_preview_container">
                                                                    <img src={selectedFilePreview} alt="File Preview" className="file_preview_image" />
                                                                    <button className="remove_button" onClick={() => setSelectedFilePreview(null)}>
                                                                        <IoCloseCircleOutline size={18} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {isBlocked && (
                                                                <div className='blockedText'>
                                                                    {activeTab === 'buying' ? (

                                                                        <span>
                                                                            {t("youhaveblocked")}{" "}
                                                                            <span className='tap' onClick={() => handleUnBlockUser(selectedTabData?.seller?.id)}>
                                                                                {t("unblock")}.
                                                                            </span>
                                                                        </span>
                                                                    ) : (
                                                                        <span>
                                                                            {t("youhaveblocked")}{" "}
                                                                            <span className='tap' onClick={() => handleUnBlockUser(selectedTabData?.buyer?.id)}>
                                                                                {t("unblock")}.
                                                                            </span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div className="inputs">
                                                                <div className="file_attach_input">
                                                                    <label htmlFor="file_attach" className={`file_attach2 ${isBlocked ? 'disabled' : ''}`}>
                                                                        <IoMdAttach size={30} className={`file_attach ${IsShowRating && 'cursor_default'}`} />
                                                                    </label>
                                                                    <textarea
                                                                        name="chatmessage"
                                                                        id="chatmessage"
                                                                        className="chat_message"
                                                                        placeholder={IsShowRating ? t("chatIsDisable") : t("typeMessageHere")}
                                                                        value={messageInput}
                                                                        onChange={(e) => setMessageInput(e.target.value)}
                                                                        onKeyDown={handleKeyDown}
                                                                        disabled={IsShowRating}
                                                                    />
                                                                </div>
                                                                <div className="audio_send_cont">
                                                                    {/* {!recording ? (
                                                                <button onClick={startRecording}>
                                                                    <MdKeyboardVoice size={24} color="#595B6C" />
                                                                </button>
                                                            ) : (
                                                                <button onClick={stopRecording}>
                                                                    <BsFillMicMuteFill size={24} color="#595B6C" />
                                                                </button>
                                                            )} */}
                                                                    <button
                                                                        className="bisend_cont"
                                                                        onClick={sendMessage}
                                                                        disabled={isBlocked || isSending || (!messageInput && !selectedFile && !selectedAudio)}
                                                                        style={{ opacity: (isBlocked || isSending || (!messageInput && !selectedFile && !selectedAudio)) ? 0.5 : 1 }}
                                                                    >
                                                                        <BiSend size={24} color="white" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {viewerImage && (
                    <ImageViewer
                        src={viewerImage}
                        alt="Full size image"
                        onClose={() => setViewerImage(null)}
                    />
                )}
            </div >
        </>
    )
}

export default Chat;
