import appwriteServices from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useState, useEffect } from "react";

function AllPosts() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteServices.getPosts([])
        .then((posts) => {
            if(posts) {
                setPosts(posts.documents);
            }
        })
    }, [])

    return (
        <div className="w-full py-8 bg-black">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map((post) => (
                        <div key={post.$id} className="w-1/4 p-2">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts;