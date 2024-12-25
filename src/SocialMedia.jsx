import React, { useState, useEffect } from 'react';
import SidebarLayout from './components/SidebarLayout';
import TopBar from './components/Topbar'
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const SocialMediaPage = () => {
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPost, setNewPost] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [newComments, setNewComments] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('user_id');
            const response = await axios.get(`http://localhost:8000/user/feed/all/${userId}/`);
            setPosts(response.data);
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
            const formData = new FormData();
            formData.append('user_id', localStorage.getItem('user_id'));
            formData.append('content', newPost);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await axios.post('http://localhost:8000/user/feed/post/', formData);
            fetchPosts(); // Refresh posts after creation
            setNewPost('');
            setSelectedImage(null);
        } catch (err) {
            setError('Failed to create post');
            console.error(err);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post('http://localhost:8000/user/feed/like/', {
                user_id: localStorage.getItem('user_id'),
                post_id: postId
            });
            
            // Update posts with new like status
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.post_id === postId 
                        ? { 
                            ...post, 
                            likes: post.liked ? post.likes - 1 : post.likes + 1,
                            liked: !post.liked 
                          }
                        : post
                )
            );
        } catch (err) {
            setError('Failed to like post');
            console.error(err);
        }
    };

    const handleComment = async (postId) => {
        if (!newComments[postId]?.trim()) return;
        
        try {
            await axios.post('http://localhost:8000/user/feed/comment/', {
                "user_id": localStorage.getItem('user_id'),
                "post_id": postId,
                "content": newComments[postId]
            });

            // Refresh posts to get new comment
            fetchPosts();
            
            // Clear comment input
            setNewComments(prev => ({
                ...prev,
                [postId]: ''
            }));
        } catch (err) {
            setError('Failed to post comment');
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
                            <input 
                                type="file" 
                                className="form-control mb-3" 
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                            />
                            <button type="submit" className="btn btn-primary">Post</button>
                        </form>
                    </div>
                </div>

                {/* Updated Posts Feed */}
                {posts.map(post => (
                    <div key={post.post_id} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                                <img 
                                    src={post.user_image || `https://ui-avatars.com/api/?name=${post.user_name}`}
                                    alt={post.user_name}
                                    className="rounded-circle me-2"
                                    width="40"
                                    height="40"
                                    style={{ objectFit: 'cover' }}
                                />
                                <div>
                                    <h6 className="mb-0">{post.user_name}</h6>
                                    <small className="text-muted">
                                        {new Date(post.created_at).toLocaleString()}
                                    </small>
                                </div>
                            </div>
                            <p className="card-text">{post.content}</p>
                            {post.image && (
                                <img 
                                    src={post.image}
                                    alt="Post content"
                                    className="img-fluid rounded mb-3"
                                />
                            )}

                            <div className="d-flex align-items-center mt-3">
                                <button 
                                    className="btn btn-link text-decoration-none"
                                    onClick={() => handleLike(post.post_id)}
                                >
                                    {post.liked ? (
                                        <FaHeart className="text-danger me-1" />
                                    ) : (
                                        <FaRegHeart className="text-danger me-1" />
                                    )}
                                    {post.likes || 0} Likes
                                </button>
                            </div>

                            {/* Comments Section */}
                            {post.comments.length > 0 && (
                                <div className="mt-3">
                                    <h6>Comments</h6>
                                    {post.comments.map(comment => (
                                        <div key={comment.comment_id} className="d-flex mb-2">
                                            <img 
                                                src={comment.user_image || `https://ui-avatars.com/api/?name=${comment.user_name}`}
                                                alt={comment.user_name}
                                                className="rounded-circle me-2"
                                                width="30"
                                                height="30"
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <div>
                                                <div className="bg-light p-2 rounded">
                                                    <strong>{comment.user_name}</strong>
                                                    <p className="mb-0">{comment.content}</p>
                                                </div>
                                                <small className="text-muted">
                                                    {new Date(comment.created_at).toLocaleString()}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="card-footer bg-white">
                            <form 
                                className="d-flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleComment(post.post_id);
                                }}
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Write a comment..."
                                    value={newComments[post.post_id] || ''}
                                    onChange={(e) => setNewComments(prev => ({
                                        ...prev,
                                        [post.post_id]: e.target.value
                                    }))}
                                />
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={!newComments[post.post_id]?.trim()}
                                >
                                    Comment
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </SidebarLayout>
    );
};

export default SocialMediaPage;