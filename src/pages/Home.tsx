import React, { useState, useEffect } from 'react';
import axios from '../API/axiosConfig';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Article {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}

const Home: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        fetchArticles(page);
    }, [page]);

    const fetchArticles = async (page: number) => {
        try {
            const response = await axios.get(`/top-headlines`, {
                params: {
                    country: 'us',
                    page: page,
                    pageSize: 10,
                },
            });
            if (response.data.articles.length > 0) {
                setArticles((prevArticles) => [...prevArticles, ...response.data.articles]);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <Container className="home">
            <h1>Top Headlines</h1>
            <Row className="article-container">
                {articles.map((article, index) => (
                    <Col key={index} xs={12} className="article">
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                        <Link to={`/article/${index}`}>
                            Read more
                        </Link>
                    </Col>
                ))}
            </Row>
            {hasMore && (
                <Button onClick={loadMore} className="load-more">
                    Load More
                </Button>
            )}
        </Container>
    );
};

export default Home;
