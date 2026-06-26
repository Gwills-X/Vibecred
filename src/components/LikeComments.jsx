"use client";

import { useState } from "react";
import { createPosts } from "@/actions/posts";
import { deleteCommentAction } from "@/actions/deleteComment";

export default function LikeComments({ post, currentUserId, comments = [] }) {
  const [activeReplyBoxId, setActiveReplyBoxId] = useState(null);

  // 🌲 Cleaned tree builder strictly referencing database parent_id snake_case field layout
  const buildTree = (nodes) => {
    const map = {};
    const roots = [];

    // Step 1: Index all comment rows cleanly inside a working map
    nodes.forEach((node) => {
      map[node.id] = { ...node, children: [] };
    });

    // Step 2: Structure tree hierarchies
    nodes.forEach((node) => {
      const pId = node.parent_id;

      if (pId && map[pId]) {
        // Valid parent comment node exists: append to children array
        map[pId].children.push(map[node.id]);
      } else {
        // Direct post comment or fallback: keep at root tier so it shows on screen
        roots.push(map[node.id]);
      }
    });
    return roots;
  };

  const commentTree = buildTree(comments);

  // 🔄 Recursive Node Rendering Engine
  const CommentNode = ({ node, depth = 0 }) => {
    const nodeCreatedAt = node.created_at || node.createdAt;

    return (
      <div
        className='relative border-l border-slate-800 pl-4 mt-4 transition-all'
        style={{
          marginLeft: depth > 0 ? `${Math.min(depth * 0.5, 2)}rem` : "0rem",
        }}>
        {/* Connection node dot element indicator */}
        <div className='absolute -left-[4.5px] top-4 w-2 h-2 rounded-full bg-slate-800' />

        <div className='bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/50 transition-all'>
          <div className='flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1'>
            <span className='text-emerald-400 font-bold'>
              @{node.author || "anonymous"}
            </span>
            <div className='flex items-center gap-3'>
              {nodeCreatedAt && (
                <span>
                  {new Date(nodeCreatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              )}

              {/* 🗑️ SECURE DELETE ACTION KEY */}
              {currentUserId &&
                currentUserId === (node.authorId || node.author_id) && (
                  <button
                    onClick={async () => {
                      if (
                        confirm("Confirm removal of this pulse node thread?")
                      ) {
                        await deleteCommentAction(
                          node.id,
                          post.id,
                          currentUserId,
                        );
                      }
                    }}
                    className='text-red-400/70 hover:text-red-400 transition-colors uppercase font-bold text-[10px]'>
                    [Delete]
                  </button>
                )}
            </div>
          </div>

          <p className='text-xs text-slate-300 font-sans leading-relaxed'>
            {node.content}
          </p>

          {/* 🛠️ REPLY INTERACTION TRIGGERS */}
          {currentUserId ? (
            <div className='mt-2'>
              <button
                onClick={() =>
                  setActiveReplyBoxId(
                    activeReplyBoxId === node.id ? null : node.id,
                  )
                }
                className='text-[10px] font-mono uppercase text-slate-500 hover:text-emerald-400 transition-colors'>
                {activeReplyBoxId === node.id
                  ? "// Close Array"
                  : "// Inject Reply Node"}
              </button>

              {/* Nested Input Field Box */}
              {activeReplyBoxId === node.id && (
                <form
                  action={async (formData) => {
                    await createPosts(null, formData);
                    setActiveReplyBoxId(null);
                  }}
                  className='mt-3 flex gap-2'>
                  {/* Changed name from parentId to parent_id to match your database layer schema */}
                  <input type='hidden' name='parent_id' value={node.id} />
                  <input
                    type='text'
                    name='content'
                    placeholder={`Reply directly to @${node.author}...`}
                    className='w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500'
                    required
                  />
                  <button
                    type='submit'
                    className='px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold uppercase rounded-lg transition-colors'>
                    Transmit
                  </button>
                </form>
              )}
            </div>
          ) : (
            <span className='text-[9px] font-mono text-slate-600 tracking-tight block mt-1'>
              // Authenticate to inject node interaction lines.
            </span>
          )}
        </div>

        {/* 🌲 Output sub-child arrays iteratively under their parents */}
        {node.children &&
          node.children.map((child) => (
            <CommentNode key={child.id} node={child} depth={depth + 1} />
          ))}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* 📥 TOP LEVEL COMMENT INPUT INJECTION INTERFACE */}
      <div className='bg-slate-900/20 border border-slate-800/80 rounded-2xl p-4 mt-4'>
        <h3 className='text-xs font-mono font-bold uppercase text-slate-400 mb-2'>
          Broadcast New Thread Node
        </h3>
        {currentUserId ? (
          <form
            action={async (formData) => {
              await createPosts(null, formData);
            }}
            className='flex flex-col gap-2'>
            {/* Top-tier comments pass post.id to group it to this timeline segment */}
            <input type='hidden' name='parent_id' value={post.id} />
            <textarea
              name='content'
              placeholder='Type out your response array payload here...'
              rows={3}
              className='w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none'
              required
            />
            <div className='flex justify-end'>
              <button
                type='submit'
                className='px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-mono font-bold uppercase rounded-xl transition-colors'>
                Transmit Pulse
              </button>
            </div>
          </form>
        ) : (
          <div className='p-3 bg-slate-950/40 border border-slate-900 rounded-xl text-center'>
            <p className='text-xs font-mono text-slate-500 italic'>
              // Core stream locked. Please sign in to write comments on this
              pipeline.
            </p>
          </div>
        )}
      </div>

      {/* SYSTEM THREADS LAYER */}
      <div className='mt-8 pt-6 border-t border-slate-800/60'>
        <h2 className='text-sm font-mono font-bold uppercase tracking-wider text-slate-400 mb-4'>
          System Threads Layer
        </h2>

        {commentTree.length === 0 ? (
          <p className='text-xs font-mono text-slate-600 italic'>
            // No nodes on this segment loop.
          </p>
        ) : (
          commentTree.map((rootComment) => (
            <CommentNode key={rootComment.id} node={rootComment} />
          ))
        )}
      </div>
    </div>
  );
}
