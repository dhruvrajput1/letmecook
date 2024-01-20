import { useState, useEffect } from "react";
import appwriteServices from "../appwrite/config";
import { Container, PostCard } from "../components";

function Home() {

    const [posts, setPosts] = useState([]);

    useEffect(() =>{
        appwriteServices.getPosts()
        .then((posts) => {
            if(posts) {
                setPosts(posts.documents);
            }
        })
    }, [])

    if(posts.length === 0) {
        return (
            <div className="w-full py-8 mt-0 text-center bg-black">
                <Container>
                    <div className=" flex-wrap flex ">
                        <div className="p-2 w-1/2">
                            <h1 className="text-7xl text-left font-bold hover:text-gray-500">
                                Welcome to <span className="text-orange-500">letmecook</span> 
                            </h1>

                            <h2 className="text-5xl text-left font-bold hover:text-gray-500 mt-20">
                                visual representation of <span className="text-pink-500 ">thoughts</span>  being cooked (real)
                            </h2>
                        </div>
                        <div className="w-96 mx-auto">
                            <img className="m-auto" src="/cook.png" />
                        </div>
                    </div>
                </Container>
            </div>
        )
        
    }

    return (
        <div className='w-full py-8 bg-black'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home;