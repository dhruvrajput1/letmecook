import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthenticated = useSelector((state) => state.auth.status);

    const isAuthor = post && userData ? post.userid === userData.userData.$id : false;

    const [like, setLike] = useState(0);
    const [dislike, setDislike] = useState(0);
    const [comments, setComments] = useState([]);
    const [commentCnt, setCommentCnt] = useState(0);
    const [postBy, setPostBy] = useState("");


    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    setLike(post.likeCnt);
                    setDislike(post.dislikeCnt);
                    setComments(post.commentss);
                    setCommentCnt(post.commentCnt);
                    setPostBy(post.uploadedBy);
                }
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.capturedImage);
                navigate("/");
            }
        });
    };


    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const handleLikeClick = () => {
        if (liked === false && disliked === false) {
            setLike(like + 1);
            appwriteService.updatePost(post.$id, {
                likeCnt: post.likeCnt + 1,
            });
            setLiked(true);
            setDisliked(false);
        }
        else if (liked === false && disliked === true) {
            setDislike(dislike - 1);
            setLike(like + 1);
            appwriteService.updatePost(post.$id, {
                likeCnt: post.likeCnt + 1,
                dislikeCnt: post.dislikeCnt - 1,
            });
            setLiked(true);
            setDisliked(false);
        }
    }

    const handleDislikeClick = () => {
        if (disliked === false && liked === false) {
            setDisliked(true);
            setDislike(dislike + 1);
            appwriteService.updatePost(post.$id, {
                dislikeCnt: post.dislikeCnt + 1,
            });
            setLiked(false);
        }
        else if (disliked === false && liked === true) {
            setDisliked(true);
            setDislike(dislike + 1);
            setLike(like - 1);
            appwriteService.updatePost(post.$id, {
                dislikeCnt: post.dislikeCnt + 1,
                likeCnt: post.likeCnt - 1
            });
            setLiked(false);
        }
    }




    const userName = userData ? userData.userData.name : "Anonymous";


    const handleSubmit = async (e) => {
        e.preventDefault();
        const commentText = e.target[0].value;

        const currentdate = new Date();
        const currTime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        const newComment = { userName, comment: commentText, currTime };

        setCommentCnt(commentCnt + 1);
        setComments((prevComments) => [...prevComments, newComment]);

        const updatedComments = [...comments, JSON.stringify(newComment)];

        await appwriteService.updatePost(post.$id, {
            commentss: updatedComments, // Use the updated comments array
            commentsCnt: post.commentsCnt + 1
        })
            .then(() => {
                // Fetch the updated post after the update
                return appwriteService.getPost(post.$id);
            })
            .then((updatedPost) => {
                // Handle success, if needed
                console.log("Post updated with new comment", updatedPost);
                setPost(updatedPost); // Update the local post state with the latest data
            })
            .catch((error) => {
                // Handle error
                console.error("Error updating post with new comment", error);
            });

        // Clear the textarea after submitting a comment
        e.target[0].value = '';

        // Reload the page to see the new comment
        location.reload();
    }

    return post ? (
        <div className="py-8 bg-black">
            <Container>
                <div className="w-full mb-6">
                    <h1 className="text-5xl text-left ml-3 mt-10 mb-10 font-bold">{post.title}</h1>
                </div>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">

                    <img
                        src={appwriteService.getFilePreview(post.capturedImage)}
                        alt={post.title}
                        className="rounded-xl w-100px"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button btnText="Edit" bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button btnText="Delete" bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-20 browser-css">
                    {parse(post.content)}
                </div>

                <p className="my-10">Posted By {postBy}</p>

                {isAuthenticated && (

                    <div>
                        <Button onClick={handleLikeClick} className={`  border-slate-400 mr-3 mt-3 ${liked ? 'bg-green-500' : 'bg-gray-800'} `} btnText={`Like ${like}`}></Button>
                        <Button onClick={handleDislikeClick} className={` border-slate-400 ${disliked ? 'bg-red-500' : 'bg-gray-800'}`} btnText={`Disike ${dislike}`}></Button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <h1 className="text-pink-500 text-left blockfont-bold mb-2" htmlFor="comment">
                            Comments
                        </h1>
                        <textarea
                            className=" mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                            id="comment"
                            placeholder="Enter your comment"
                        ></textarea>
                    </div>
                    <div className="mt-4">
                        <Button bgColor="#0000" className=" mb-10 border-slate-600 " btnText="Add Comment" />
                    </div>
                </form>


                {comments?.map((comment, index) => {

                    try {
                        const parsedComment = JSON.parse(comment);
                        console.log("parsed comment is ", parsedComment)


                        return (
                            <div className="border-2  border-amber-600 mb-3 px-3 py-3 border-double rounded-lg" key={index}>
                                <div className="flex">
                                    <h3 className="mr-3 text-lg  font-serif">{parsedComment.userName}</h3>
                                    <p>{parsedComment.currTime}</p>
                                </div>

                                <p className="flex font-sans">{parsedComment.comment}</p>
                            </div>

                        )

                    } catch (err) {
                        console.log("got error while parsing the comment, ", err);
                    }

                })}


            </Container>
        </div>
    ) : null;
}
