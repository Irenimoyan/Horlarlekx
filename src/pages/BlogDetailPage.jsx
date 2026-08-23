import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Clock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { blogData } from '../data/blogData';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogData.find((b) => b.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="pt-28 pb-20 bg-navy-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs
          items={[
            { label: 'Blog', path: '/blog' },
            { label: post.title }
          ]}
        />

        <div className="py-6 space-y-4 border-b border-navy-800">
          <Badge variant="orange">{post.category}</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="py-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-navy-700 max-h-[450px]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="py-6 space-y-6 text-slate-300 text-base leading-relaxed border-b border-navy-800">
          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="py-8 flex items-center justify-between">
          <Link to="/blog" className="inline-flex items-center space-x-2 text-sm font-bold text-brand-orange hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
          <Button to="/quote" variant="primary" size="md">
            Request Project Quotation
          </Button>
        </div>

      </div>
    </div>
  );
}
