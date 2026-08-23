import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import { Clock, User, ArrowRight } from 'lucide-react';
import { blogData } from '../data/blogData';

export default function BlogPage() {
  return (
    <div className="pt-28 pb-20 bg-navy-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Blog & Articles' }]} />

        <div className="py-8 border-b border-navy-800">
          <Badge variant="orange">Architectural Insights</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight mt-3">
            HORLARLEKX Construction & Facade Blog
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Educational articles, technical insights, and architectural trends on ACP cladding, building facades, signage, and building finishing.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogData.map((post) => (
            <div
              key={post.id}
              className="bg-navy-900 rounded-xl border border-navy-800 hover:border-brand-orange/60 overflow-hidden shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 bg-navy-950 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="orange" size="sm">{post.category}</Badge>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-brand-orange" />
                      <span>{post.readTime}</span>
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-heading group-hover:text-brand-orange transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-navy-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{post.author}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-xs font-bold text-brand-orange hover:text-white uppercase tracking-wider transition-colors flex items-center space-x-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
