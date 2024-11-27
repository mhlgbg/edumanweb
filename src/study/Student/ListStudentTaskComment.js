import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CFormSelect, CFormInput, CFormTextarea, CButton } from '@coreui/react';
import axios from '../../api/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS cho trình soạn thảo

const ListStudentTaskComment = () => {
    const { userTaskId } = useParams();
    const [taskDetails, setTaskDetails] = useState({});
    const [comments, setComments] = useState([]);
    const [contentType, setContentType] = useState('html');
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const response = await axios.get(`/student-task/${userTaskId}`);
                setTaskDetails(response.data.task);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin nhiệm vụ:', error);
            }
        };

        fetchTaskDetails();
    }, [userTaskId]);

    const handleContentTypeChange = (e) => {
        setContentType(e.target.value);
        setContent(''); // Reset content khi thay đổi loại
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleFileChange = (e) => {
        // Xử lý khi loại nội dung là image và người dùng upload ảnh
        setContent(e.target.files[0]);
    };

    const handleSubmitComment = async () => {
        // Gửi bình luận đến server
        const formData = new FormData();
        formData.append('contentType', contentType);
        formData.append('content', content);

        try {
            await axios.post(`/student-task/${userTaskId}/comment`, formData);
            setContent(''); // Xóa nội dung sau khi nộp
            // Refresh comments after submission
            const response = await axios.get(`/student-task/${userTaskId}`);
            setComments(response.data.comments);
        } catch (error) {
            console.error('Lỗi khi nộp nhận xét:', error);
        }
    };

    return (
        <CCard>
            <CCardHeader>
                <h5>{taskDetails.taskId?.title}</h5>
                <p>{taskDetails.taskId?.description?.replace(/^<p>(.*?)<\/p>$/i, '$1')}</p>
                <p>Ngày Đến Hạn: {new Date(taskDetails.dueDate).toLocaleDateString()}</p>
            </CCardHeader>
            <CCardBody>
                <div className="mb-3">
                    <CFormSelect value={contentType} onChange={handleContentTypeChange}>
                        <option value="html">HTML</option>
                        <option value="text">Text</option>
                        <option value="youtube">YouTube</option>
                        <option value="image">Image</option>
                    </CFormSelect>
                </div>

                {contentType === 'html' && (
                    <ReactQuill
                        value={content}
                        onChange={setContent} // `ReactQuill` gọi `onChange` với HTML đã soạn
                        placeholder="Soạn thảo nội dung HTML"
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'image'],
                                ['clean']
                            ]
                        }}         
                        style={{ height: '300px', marginBottom: '50px' }} // Điều chỉnh chiều cao và khoảng cách dưới
                    />
                )}
                {contentType === 'text' && <CFormInput value={content} onChange={handleContentChange} placeholder="Nhập văn bản" />}
                {contentType === 'youtube' && <CFormInput value={content} onChange={handleContentChange} placeholder="Dán link YouTube" />}
                {contentType === 'image' && <CFormInput type="file" onChange={handleFileChange} />}

                <CButton color="primary" onClick={handleSubmitComment}>Nộp Nhận Xét</CButton>

                <h6 className="mt-4">Bài Viết Trước Đó</h6>
                <ul>
                    {comments.map(comment => (
                        <li key={comment._id}>
                            <p><strong>Người viết:</strong> {comment.userCommentId.fullName}</p>
                            <p><strong>Thời điểm:</strong> {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Không có thời gian'}</p>

                            {/* Hiển thị nội dung dựa trên contentType */}
                            {comment.contentType === 'image' && (
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}/${comment.content}`}
                                    width="100px"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/${comment.content}`, '_blank')}
                                    alt="User uploaded content"
                                />
                            )}
                            {comment.contentType === 'youtube' && (
                                <iframe
                                    width="560"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${comment.content}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                            {(comment.contentType === 'text' || comment.contentType === 'html') && (
                                <p>{comment.content}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </CCardBody>
        </CCard>
    );
};

export default ListStudentTaskComment;
