import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");

	const queryClient = useQueryClient();

	const { mutate: createPostMutation, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
			// ✅ correct query key for profile posts
			queryClient.invalidateQueries({ queryKey: ["userPosts", user._id] });
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Failed to create post");
		},
	});

	const handlePostCreation = () => {
		if (!content.trim()) return toast.error("Post content cannot be empty");

		const postData = { content };
		createPostMutation(postData);
	};

	const resetForm = () => {
		setContent("");
	};

	return (
		<div className='bg-secondary rounded-lg shadow mb-4 p-4'>
			<div className='flex space-x-3'>
				<img
					src={user?.profilePicture || "/avatar.png"}
					alt={user?.name}
					className='size-12 rounded-full'
				/>
				<textarea
					placeholder="What's on your mind?"
					className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</div>

			<div className='flex justify-center items-center mt-4'>
				<button
					className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'
					onClick={handlePostCreation}
					disabled={isPending}
				>
					{isPending ? <Loader className='size-5 animate-spin' /> : "Post"}
				</button>
			</div>
		</div>
	);
};

export default PostCreation;
