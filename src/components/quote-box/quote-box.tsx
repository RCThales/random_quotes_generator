import { useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import styles from "./quote-box.module.css";
import axios from "axios";

const QuoteBox = () => {
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [quoteGenres, setQuoteGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState<string>("age");
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  useEffect(function fetchQuoteGenres() {
    const apiUrl = "https://quote-garden.onrender.com/api/v3/genres";

    axios
      .get(apiUrl)
      .then((response) => {
        const data = response.data;
        setQuoteGenres(data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the quote:", error);
      });
  }, []);

  useEffect(() => {
    fetchNewQuote();
  }, []);

  const chooseGenre = (element: ChangeEvent<HTMLSelectElement>) => {
    const genre = element?.target?.value;
    setActiveGenre(genre);
  };

  const fetchNewQuote = async () => {
    setIsLoading(true);
    await fetchQuote();
    await fetchBackgroundImage();
    setIsLoading(false);
  };

  const fetchQuote = async () => {
    try {
      const response = await axios.get(
        `https://quote-garden.onrender.com/api/v3/quotes/random?genre=${activeGenre}`
      );
      const data = response.data.data[0];
      setQuoteText(data.quoteText);
      setQuoteAuthor(data.quoteAuthor);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  const fetchBackgroundImage = async () => {
    try {
      const response = await axios.get(
        "https://source.unsplash.com/random/600x400"
      );
      setBackgroundImageUrl(response.request.responseURL);
      console.log(response.request.responseURL);
    } catch (error) {
      console.error("Error fetching background image:", error);
    }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${quoteText}" - ${quoteAuthor}`
  )}`;

  return (
    <>
      <div
        id="quote-bg"
        className={styles.quote_bg}
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      ></div>
      <div id="quote-box" className={styles.quote_box}>
        <div className={styles.quote_inner}>
          {isLoading ? (
            <div className={styles.spinner}></div>
          ) : (
            <div id="quote-wrapper" className={styles.quote_wrapper}>
              <q id="text" className={styles.quote_text}>
                {quoteText}
              </q>
              <p id="author" className={styles.quote_author}>
                {quoteAuthor}
              </p>
            </div>
          )}
          <div id="quote-options" className={styles.quote_options}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={tweetUrl}
              id="tweet-quote"
              className={styles.tweet_quote}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <select onChange={chooseGenre}>
              {quoteGenres.map((genre, index) => (
                <option key={`quotes_${index}`}>{genre}</option>
              ))}
            </select>
            <button
              onClick={fetchNewQuote}
              id="new-quote"
              className={styles.new_quote}
            >
              New Quote
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuoteBox;
