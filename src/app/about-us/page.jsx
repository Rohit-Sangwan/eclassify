import AboutUs from '@/components/PagesComponent/AboutUs/AboutUs'
import axios from 'axios';
import React from 'react'

export const generateMetadata = async ({ params }) => {
  try {

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-system-settings?type=about_us`
    );

    const htmlContent = response?.data?.data?.about_us

    const stripHtmlTags = (html) => html.replace(/<\/?[^>]+>/gi, '');

    const textContent = stripHtmlTags(htmlContent);

    const generateTitle = (text) => {
      const words = text.split(/\s+/);
      return words.slice(0, 5).join(' '); // Adjust the number of words as needed
    };

    // Function to generate a description
    const generateDescription = (text) => {
      // Remove extra whitespace
      const cleanText = text.replace(/\s+/g, ' ');

      // Extract a snippet of text, e.g., first 150 characters or so
      const snippetLength = 150; // Adjust as needed
      const snippet = cleanText.slice(0, snippetLength);

      // Ensure snippet ends with a complete sentence
      const lastPeriodIndex = snippet.lastIndexOf('.');
      const lastSpaceIndex = snippet.lastIndexOf(' ');

      // Truncate to the end of the last sentence
      return lastPeriodIndex > 0 ? snippet.slice(0, lastPeriodIndex + 1) : snippet.slice(0, lastSpaceIndex) + '...';
    };


    // Generate title and description

    const stopWords = ['the', 'is', 'in', 'and', 'a', 'to', 'of', 'for', 'on', 'at', 'with', 'by', 'this', 'that', 'or', 'as', 'an', 'from', 'it', 'was', 'are', 'be', 'has', 'have', 'had', 'but', 'if', 'else'];

    const generateKeywords = (description) => {
      if (!description) {
        return process.env.NEXT_PUBLIC_META_kEYWORDS
          ? process.env.NEXT_PUBLIC_META_kEYWORDS.split(',').map(keyword => keyword.trim())
          : [];
      }

      // Convert description to lowercase, remove punctuation, and split into words
      const words = description
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);

      // Filter out common stop words
      const filteredWords = words.filter(word => !stopWords.includes(word));

      // Count the frequency of each word
      const wordFrequency = filteredWords.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});

      // Sort words by frequency and return the top keywords
      const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);

      // Return top 10 keywords (or less if there are fewer words)
      return sortedWords.slice(0, 10);
    }

    const title = generateTitle(textContent);
    const description = generateDescription(textContent);
    const keywords = generateKeywords(description)

    return {
      title: title ? title : process.env.NEXT_PUBLIC_META_TITLE,
      description: description ? description : process.env.NEXT_PUBLIC_META_DESCRIPTION,
      openGraph: {
        images: [],
      },
      keywords: keywords
    };
  } catch (error) {
    console.error("Error fetching MetaData:", error);
    return null;
  }
};



const page = () => {
  return (
    <div>
      {/* <SEO /> */}
      <AboutUs />
    </div>
  )
}

export default page
