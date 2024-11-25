'use client' // Error components must be Client Components
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import somthingWrong from "../../public/assets/something_went_wrong.svg";
import { placeholderImage, t } from '@/utils';
import Image from 'next/image';

export default function Error({ error, reset }) {
    const router = useRouter()
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])
    const navigateHome = () => {
        router.push('/')
        reset()
    }
    return (
        <div className='wentWrong'>
          <div className="col-12 text-center">
            <div>
                <Image loading="lazy" src={somthingWrong} alt="no_img" width={200} height={200}  onError={placeholderImage}/>
            </div>
            <div className="no_data_found_text">
                <h3>{t('somthingWentWrong')}</h3>
                <span>{t('tryLater')}</span>
                <button onClick={navigateHome}>
                    {t("home")}
                </button>
            </div>
        </div>
        </div>
    )
}