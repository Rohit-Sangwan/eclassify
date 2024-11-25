'use client';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoPlus } from "react-icons/go";
import { LuMinus } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { setBreadcrumbPath } from '@/redux/reuducer/breadCrumbSlice';
import { t } from '@/utils';
import { usePathname } from 'next/navigation'
import { setCateData, LastPage, setCatLastPage, CurrentPage, setCatCurrentPage } from '@/redux/reuducer/categorySlice'
import { categoryApi } from '@/utils/api'
import { setSearch } from '@/redux/reuducer/searchSlice';
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';

const FilterTree = ({ slug, show, setShow, setCategoryIds }) => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState(true)
    const { cateData } = useSelector((state) => state.Category);
    const lastPage = useSelector(LastPage)
    const currentPage = useSelector(CurrentPage)
    const [treeData, setTreeData] = useState([]);
    const [Loading, setLoading] = useState(true);
    const initialSelectedKeys = pathname === '/products' ? ['all-categories'] : (slug ? [slug] : []);
    const [selectedKeys, setSelectedKeys] = useState(initialSelectedKeys);
    const [isLoading, setIsLoading] = useState(false);
    const CurrentLanguage = useSelector(CurrentLanguageData)

    useEffect(() => {
        const fetchDataAndSetTree = async () => {
            if (cateData.length > 0) {
                const treeData = await constructTreeData(cateData, [{ name: t('allCategories'), slug: '/products' }], 0);
                const totalApprovedItems = treeData.length > 0 ? treeData?.reduce((sum, cat) => sum + cat.count, 0) : 0;
                setTreeData([{
                    title: t("allCategories"),
                    key: "all-categories",
                    count: totalApprovedItems,
                    path: [{ name: t('products'), slug: '/products' }],
                    children: treeData
                }]);
            }
            setLoading(false);
        };

        fetchDataAndSetTree();
        setLoading(false)
    }, [cateData, CurrentLanguage]);



    const constructTreeData = async (categories, path, level = 0) => {

        const treeDataPromises = categories?.map(async (category) => {
            const newPath = [...path, { name: category.translated_name, slug: category.slug, id: category.id }];

            const children = (level < 2 && category.subcategories_count > 0)
                ? await constructTreeData(category.subcategories, newPath, level + 1)
                : category.subcategories_count > 0 ? await fetchData(category, newPath) : [];

            const totalApprovedItems = children?.length > 0 ? children?.reduce((sum, cat) => sum + cat.count, 0) + category?.approved_items_count : category?.approved_items_count;

            return {
                title: category?.translated_name,
                key: category?.slug,
                slug: category?.slug,
                id: category?.id,
                count: totalApprovedItems,
                path: newPath,
                children: children
            };
        });
        return Promise.all(treeDataPromises);
    };

    const fetchData = async (category, path) => {
        try {
            const response = await categoryApi.getCategory({ category_id: category?.id });
            const { data } = response?.data?.data;
            return data?.map(subcategory => ({
                title: subcategory.translated_name,
                key: subcategory.slug,
                slug: subcategory.slug,
                id: subcategory.id,
                count: subcategory.approved_items_count,
                path: [...path, { name: subcategory.translated_name, slug: subcategory.slug, id: category.id }],
            }));

        } catch (error) {
            console.log(error)
        }
    }

    const onExpand = () => {
        setIsExpanded(!isExpanded)
    };


    const renderTreeNode = (node) => {

        const isBold = node.key === 'all-categories';
        const isSelected = selectedKeys.includes(node.key);
        const isAllCatSelected = selectedKeys.includes('all-categories')

        return (
            <div className={`filter_item_cont ${(isSelected || isAllCatSelected) ? 'selected' : ''}`}>
                <span className={`filter_item ${isBold ? 'bold' : ''}`}>{node?.title}</span>
                <span className={`filter_item_count ${isBold ? 'bold' : ''}`}>({node.count})</span>
            </div>
        );
    };

    const switcherIcon = (node) => {
        const isBold = node?.data?.key === 'all-categories';
        const iconColor = isBold ? 'black' : '#595b6c';
        return node?.expanded ? <LuMinus size={14} color={iconColor} fontWeight={600} /> : <GoPlus size={14} color={iconColor} fontWeight={600} />;
    };

    const onSelect = (selectedKeys, info) => {
        if (selectedKeys.length === 0) {
            return
        }

        if (show) {
            setShow(false)
        }

        dispatch(setSearch(''))

        setSelectedKeys(selectedKeys);
        const newSlug = info?.node?.key;

        if (selectedKeys.includes('all-categories')) {
            router.replace('/products');
        } else {
            router.replace(`/category/${newSlug}`);
        }

    };


    const findNodeById = (nodes, id) => {

        for (let node of nodes) {
            if (node.key === slug) {
                return node;
            }
            if (node.children) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };


    useEffect(() => {
        if (slug && treeData.length > 0) {
            const selectedNode = findNodeById(treeData, slug);
            if (selectedNode) {
                dispatch(setBreadcrumbPath(selectedNode.path));
                const parentCategories = selectedNode.path.slice(1);
                // Extract the IDs and join them into a comma-separated string
                const parentCategoryIds = parentCategories.map(category => category.id).join(',');
                if (typeof setCategoryIds === 'function') {
                    setCategoryIds(parentCategoryIds);
                }
                setSelectedKeys([selectedNode?.key]); // Update selectedKeys
            }
        }
    }, [slug, treeData, dispatch]);

    const fetchMoreCategory = async () => {
        setIsLoading(true)
        try {
            const response = await categoryApi.getCategory({ page: `${currentPage + 1}` });
            const { data } = response.data;
            if (data && Array.isArray(data.data)) {
                dispatch(setCateData([...cateData, ...data.data]));
                dispatch(setCatLastPage(data?.last_page))
                dispatch(setCatCurrentPage(data?.current_page))
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false)
            console.error("Error:", error);
        } finally {
            setIsLoading(false)
        }
    }

    const defaultExpandedKeys = initialSelectedKeys.length !== 0 ? initialSelectedKeys : ['all-categories']

    return (
        !Loading &&
        <div>
            {
                treeData.length > 0 &&
                <Tree
                    treeData={treeData}
                    titleRender={(node, index) => renderTreeNode(node, index === 0)}
                    className="catTree"
                    switcherIcon={(node) => switcherIcon(node)}
                    defaultExpandAll={false}
                    selectedKeys={selectedKeys}
                    onSelect={onSelect}
                    onExpand={onExpand}
                    defaultExpandedKeys={defaultExpandedKeys}
                />
            }

            {
                isLoading ?
                    <div className="loader adListingLoader"></div>
                    :
                    
                    isExpanded && currentPage < lastPage &&
                    <div className="loadMore">
                        <button onClick={fetchMoreCategory}> {t('loadMore')} </button>
                    </div>
            }


        </div>

    );
};

export default FilterTree;