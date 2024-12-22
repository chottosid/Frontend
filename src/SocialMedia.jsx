import React, { useState, useEffect } from 'react';
import SidebarLayout from './components/SidebarLayout';
import TopBar from './components/Topbar'
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const SocialMediaPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPost, setNewPost] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            // Future API call
            // const response = await fetch('/api/posts');
            // const data = await response.json();
            
            // Temporary mock data
            const data = [
                {
                    id: 1,
                    user: 'John Doe',
                    content: 'Just finished my morning workout! 💪',
                    likes: 15,
                    comments: 3,
                    isLiked: false,
                    timestamp: '2 hours ago'
                },
                {
                    id: 2,
                    user: 'Jane Smith',
                    content: 'Great session with my fitness trainer today! 🏋️‍♀️',
                    likes: 24,
                    comments: 5,
                    isLiked: false,
                    timestamp: '4 hours ago'
                }
            ];
            setPosts(data);
        } catch (err) {
            setError('Failed to fetch posts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        
        try {
            // Future API call
            // const response = await fetch('/api/posts', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`
            //     },
            //     body: JSON.stringify({ content: newPost })
            // });
            // const data = await response.json();
            
            const post = {
                id: Date.now(),
                user: 'Current User',
                content: newPost,
                likes: 0,
                comments: 0,
                isLiked: false,
                timestamp: 'Just now'
            };
            
            setPosts([post, ...posts]);
            setNewPost('');
        } catch (err) {
            setError('Failed to create post');
            console.error(err);
        }
    };

    const handleLike = async (postId) => {
        try {
            // Future API call
            // await fetch(`/api/posts/${postId}/like`, {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`
            //     }
            // });
            
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { 
                        ...post, 
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                        isLiked: !post.isLiked 
                    } 
                    : post
            ));
        } catch (err) {
            setError('Failed to like post');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <SidebarLayout>
            <TopBar />
            <div className="container mt-5 pt-5">
                <h1 className="text-center mb-4">Social Feed</h1>
                
                {/* Create Post Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <form onSubmit={handlePostSubmit}>
                            <textarea 
                                className="form-control mb-3"
                                rows="3"
                                placeholder="What's on your mind?"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary">Post</button>
                        </form>
                    </div>
                </div>

                {/* Posts Feed */}
                {posts.map(post => (
                    <div key={post.id} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${post.user}&background=random`}
                                    alt={post.user}
                                    className="rounded-circle me-2"
                                    width="40"
                                />
                                <div>
                                    <h6 className="mb-0">{post.user}</h6>
                                    <small className="text-muted">{post.timestamp}</small>
                                </div>
                            </div>
                            <p className="card-text">{post.content}</p>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group">
                                    <button className="btn btn-light" onClick={() => handleLike(post.id)}>
                                        {post.isLiked ? <FaHeart className="text-danger me-1" /> : <FaRegHeart className="text-danger me-1" />}
                                        {post.likes}
                                    </button>
                                    <button className="btn btn-light">
                                        <FaComment className="text-primary me-1" />
                                        {post.comments}
                                    </button>
                                    <button className="btn btn-light">
                                        <FaShare className="text-success" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SidebarLayout>
    );
};

export default SocialMediaPage;