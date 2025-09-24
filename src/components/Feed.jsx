import { StorySection } from './StorySection';
import { Post } from './Posts';
import { PostComposer } from './PostComposer';
export const Feed = () => {
  const posts = [
    {
      author: 'Sarah Chen',
      timestamp: '2 hours ago',
      content: 'Just finished an amazing coding session! Built a new React component that I\'m really proud of. The feeling when your code works perfectly on the first try is unmatched! 🚀',
      image: true,
      likes: 24,
      comments: 8,
      shares: 3
    },
    {
      author: 'Mike Johnson',
      timestamp: '4 hours ago',
      content: 'Beautiful sunset from my morning hike today. Nature never fails to inspire and remind us of the simple pleasures in life. Hope everyone is having a wonderful day!',
      image: true,
      likes: 47,
      comments: 12,
      shares: 5
    },
    {
      author: 'Emma Wilson',
      timestamp: '6 hours ago',
      content: 'Excited to announce that I\'ll be speaking at the upcoming Tech Conference next month! Will be sharing insights about modern web development trends. Can\'t wait to connect with fellow developers!',
      image: false,
      likes: 89,
      comments: 23,
      shares: 15
    }
  ];

  return (
    <div className="lg:ml-80 xl:mr-80 min-h-screen bg-gray-100 pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        <StorySection />
        <PostComposer />
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  );
};
