'use client'
import React from 'react';
import { Collapse } from 'antd';
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";

const QuickAnswerAccordion = ({ Faq }) => {

    const items = Faq?.map(item => ({
        key: item?.id?.toString(),
        label: <span className='faq_que'>{item?.question}</span>,
        children: <p>{item?.answer}</p>,
    }));

    const expandIconRender = (panelProps) => {
        if (panelProps.isActive) {
            return <CiCircleMinus className='qui_ans_accor_icon' />
        }
        else {
            return <CiCirclePlus className='qui_ans_accor_icon' />
        }

    };

    return <Collapse items={items} className='quickanswer_accordion' defaultActiveKey={['1']} expandIconPosition='end' expandIcon={expandIconRender} />;
};
export default QuickAnswerAccordion;