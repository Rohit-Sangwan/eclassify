import React from 'react'
import AnythingYouWant from './AnythingYouWant'
import WorkProcess from './WorkProcess'
import OurBlogs from './OurBlogs'
import QuickAnswers from './QuickAnswers'


const LandingPage = () => {
  return (
    <>
      <AnythingYouWant />
      <WorkProcess />
      {/* <Subscription /> */}
      {/* <ClassifiedPosting /> */}
      <OurBlogs />
      <QuickAnswers />
    </>
  )
}

export default LandingPage
