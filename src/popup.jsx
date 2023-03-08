import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import { createRoot } from 'react-dom/client';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { InfinitySpin } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import './popup.css'
const configuration = new Configuration({
  apiKey: 'your-api-key',
});
const openai = new OpenAIApi(configuration);
function generatePrompt(title) {
  return `can you write a summary of this Youtube video :"\n${title}"`;
}


function Popup() {
  const [title, setTitle] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState(null);
  const [loading, setloading] = useState();
    const notify = () => toast.success('Copied!');;
  async function handleSubmit(event) {
    setloading(true);
    event.preventDefault();

    if (!configuration.apiKey) {
      setError({
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      });
      return;
    }

    if (title.trim().length === 0) {
      setError({
        message: 'Please enter a valid title',
      });
      return;
    }

    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: generatePrompt(title),
        temperature: 0.3,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      setResult(completion.data.choices[0].text);
      setloading(false);
    } catch (error) {
      if (error.response) {
        console.error(error.response.status, error.response.data);
        setError(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        setError({
          message: 'An error occurred during your request.',
        });
      }
    }
  }

  return (
    <div className="popup">
      <h3>"Get Summary of youtube video"</h3>
      <form onSubmit={handleSubmit}>
        <p id="text">
          <input type="text" className='search-bar' placeholder="Enter Youtube Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        </p>
        <div className='container'>
        <button type="submit" className='search-bt'>Generate</button>
        </div>
        {(!error && !loading && result)&& (
              <div className='fa'>
              <CopyToClipboard text={result}>
              <FaCopy style={ { color: "red", fontSize: "1.3em" ,border:"2px solid white"}}onClick={notify}></FaCopy>
              </CopyToClipboard>
              <Toaster/>
               </div>
        )}
        {loading && (
                <InfinitySpin 
                width='200'
                color="#4fa94d"
              />
      )}
      </form>
      {error && (
        <div>
          <p>{error.message}</p>
        </div>
      )}
      {result && (
        <div className='result'>
          <p>{result}</p>
            </div>
      )}
    </div>
  );
}
const root = createRoot(document.getElementById("react-target"));
root.render(<Popup />);