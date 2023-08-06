import React from 'react';

interface RedditPostProps {
  title: string;
  body: string;
  url: string;
}

const RedditPost: React.FC<RedditPostProps> = ({ title, body, url }) => (
  <div className="border border-gray-300 rounded p-2 mb-2 overflow-hidden whitespace-nowrap">
    <a href={url} className="text-decoration-none text-black">
      <h3 className="font-bold flex flex-wrap">{title}</h3>
    </a>
    <p className="overflow-hidden text-gray-700 flex">{body || "No text"}</p>
  </div>
);

export default RedditPost;
