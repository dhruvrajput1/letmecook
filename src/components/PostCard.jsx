import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, capturedImage, likeCnt, dislikeCnt, commentsCnt }) {

    const imageSrc = appwriteService.getFilePreview(capturedImage)
    const imageStyle = imageSrc && imageSrc.height > 50 ? { h: '50px' } : {};

    return (
        <Link to={`/post/${$id}`}>
            <div style={{backgroundColor: "#343a40"}} className='w-full border-2 border-slate-400 rounded-xl p-4'>
                <div className='w-full justify-center mb-4'>
                    <img src={imageSrc} alt={title}
                        className={`rounded-xl max-h-40`} 
                            style={imageStyle}
                        />

                </div>
                <h2
                    className='text-xl font-bold text-white'
                >{title}</h2>
                <p className="text-left mt-2 flex text-white"> <img className="w-1/12 mr-2 " src="/like.png"></img> {likeCnt}</p>
                <p className="text-left mt-2 flex text-white" > <img className="w-1/12 mr-2 text-center " src="/dislike.png"></img> {dislikeCnt} </p>

                <p className="text-left mt-2 flex text-white"> <img className="w-1/12 mr-2 text-center " src="/comment.png"></img> {commentsCnt} </p>

            </div>
        </Link>
    )
}

export default PostCard;