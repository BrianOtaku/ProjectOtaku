import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { fetchNewsByType } from '../API/apiNews';
import Aside from '../pages/Aside';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Data {
    id: number;
    title: string;
    linkDetail: string;
    imageUrl: string;
    description: string;
    content: string;
}

interface Props {
    type: string;
}

const NewsPage: React.FC<Props> = ({ type }) => {
    const [dataList, setDataList] = useState<Data[]>([]);
    const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
    const [currentItems, setCurrentItems] = useState<Data[]>([]);
    const [itemsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const getData = async () => {
            const data = await fetchNewsByType(type);
            setDataList(data);
            setCurrentItems(data.slice(0, itemsPerPage));
        };

        getData();
    }, [type, itemsPerPage]);

    const handleItemClick = (id: number) => {
        // Điều hướng đến trang chi tiết tin tức
        navigate(`/news/${id}`);
    };

    const loadMore = () => {
        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentItems(dataList.slice(0, endIndex));
        setPage(nextPage);
    };

    return (
        <Container className="home">
            {/* Danh sách dữ liệu */}
            <div className="homeandaside">
                <div className="news-list">
                    {currentItems.map((data) => (
                        <div key={data.id} className="gap-between-item">
                            <div className="news-item" onClick={() => handleItemClick(data.id)}>
                                <h2 className="news-title">{data.title}</h2>
                                <img src={data.imageUrl} alt={data.title} className="news-image" />
                                <p className="news-description">{data.description}</p>
                                {/* Vùng hiển thị nội dung của mục tin tức */}
                                {selectedNewsId === data.id && (
                                    <div className="news-content">
                                        <h3>{data.title}</h3>
                                        <img src={data.imageUrl} alt={data.title} className="news-image" />
                                        <p>{data.description}</p>
                                        <div dangerouslySetInnerHTML={{ __html: data.content }} /> {/* Nếu nội dung có HTML */}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút Load More */}
                {currentItems.length < dataList.length && (
                    <div className="load-more">
                        <button onClick={loadMore} className="load-more-button">
                            Hiển thị thêm
                        </button>
                    </div>
                )}
            </div>

            {/* Thẻ aside */}
            <div className="side-content">
                <Aside />
            </div>
        </Container>
    );
};

export default NewsPage;