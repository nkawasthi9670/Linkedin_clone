import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import ProfileHeader from "../components/ProfileHeader";
import toast from "react-hot-toast";
import BioSection from "../components/AboutSection";
import Post from "../components/Post";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();

	// Get logged in user
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
	});

	// Get profile user data
	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn: () => axiosInstance.get(`/users/${username}`),
	});

	// ✅ Get posts of the user
	const userId = userProfile?.data?._id;

	const {
		data: postsData,
		isLoading: postsLoading,
		isError: postsError,
	} = useQuery({
		queryKey: ["userPosts", userId],
		queryFn: () => axiosInstance.get(`/posts/user/${userId}`).then((res) => res.data),
		enabled: !!userId,
	});

	// Profile update
	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});

	if (isLoading || isUserProfileLoading) return null;

	const isOwnProfile = authUser.username === userProfile.data.username;
	const userData = isOwnProfile ? authUser : userProfile.data;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className="max-w-4xl mx-auto p-4 space-y-4">
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			
			<BioSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />

			<div className="mt-6 space-y-4">
				<h2 className="text-xl font-semibold">Posts</h2>
				{postsLoading ? (
					<p>Loading posts...</p>
				) : postsError ? (
					<p>Failed to load posts.</p>
				) : postsData.length > 0 ? (
					postsData.map((post) => (
						<Post key={post._id} post={post} />
					))
				) : (
					<p>No posts found.</p>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
