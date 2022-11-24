import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState();
  const [newPost, setNewPost] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/posts')
      .then(res => res.json())
      .then(data => setPosts(data.data));
  }, [loading])
  console.log("kcvbn")

  const handlePost = async (event) => {
    /**
     * Gather all the form data to state variable carFormData
     * When the form is submitted POST the data to Backend using fetch post
     * https://googlechrome.github.io/samples/fetch-api/fetch-post.html
     */

    await fetch('http://localhost:3001/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setNewPost('');
    setLoading(!loading);
  }

  const handlePostChange = event => {
    setNewPost({ content: event.target.value });
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/posts/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setLoading(!loading);
  }

  return (
    <div className='react-app-component text-center'>
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Enter your post</label>
                  <textarea className="form-control" id="post-content" rows="3" onChange={handlePostChange}></textarea>
                  <div className="d-grid gap-2">
                    <button type="button" className="btn btn-primary mt-2" onClick={handlePost}>Post</button>
                  </div>
                </div>
              </div>
            </div>

            {posts && posts.map(post => {
              return (
                <div className="card text-white bg-dark my-3 text-start" key={post._id}>
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">{post.createdAt.slice(0,10)} {post.createdAt.slice(11,16)}</h6>
                    <p className="card-text">{post.content}</p>
                    <button href="#" className="card-link" onClick={() => handleDelete(post._id)}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;