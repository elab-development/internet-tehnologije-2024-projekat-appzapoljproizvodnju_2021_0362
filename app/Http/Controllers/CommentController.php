<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $q = Comment::query()->where('user_id', $request->user()->id);

        if ($request->filled('date')) {
            $q->whereDate('comment_date', $request->get('date'));
        }

        return response()->json($q->orderBy('comment_date')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'text' => ['required','string','max:1000'],
            'date' => ['required','date'],
        ]);

        $comment = Comment::create([
            'user_id'      => $request->user()->id,
            'text'         => $data['text'],
            'comment_date' => $data['date'],
        ]);

        return response()->json($comment, 201);
    }

    public function show(Request $request, \App\Models\Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($comment);
    }

    public function destroy(Request $request, \App\Models\Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
    
    public function update(Request $request, \App\Models\Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        $comment->update($data);

        return response()->json($comment);
    }
}
