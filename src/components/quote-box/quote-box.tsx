import { useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import styles from "./quote-box.module.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const QuoteBox = () => {
  const [activeGenre, setActiveGenre] = useState<string>("age");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  const {
    data: quotes,
    isLoading,
    isError,
    refetch: refetchQuotes,
  } = useQuery({
    queryKey: ["quotes"],
    queryFn: () =>
      axios
        .get(
          `https://quote-garden.onrender.com/api/v3/quotes/random?genre=${activeGenre}`
        )
        .then((res) => res.data.data[0]),
  });

  const handleRefetch = () => {
    refetchQuotes();
  };

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    staleTime: Infinity,
    queryFn: () =>
      axios
        .get(`https://quote-garden.onrender.com/api/v3/genres`)
        .then((res) => res.data.data),
  });

  useEffect(() => {
    fetchBackgroundImage();
  }, [quotes]);

  const chooseGenre = (element: ChangeEvent<HTMLSelectElement>) => {
    const genre = element?.target?.value;
    setActiveGenre(genre);
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
    `"${quotes?.quoteText}" - ${quotes?.quoteAuthor}`
  )}`;
  return (
    <>
      <div
        id="quote-bg"
        className={styles.quote_bg}
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      ></div>
      <div id="quote-box" className={styles.quote_box}>
        {isError ? (
          <div className={styles.quote_inner}>
            <div id="quote-wrapper" className={styles.quote_wrapper}>
              <q id="text" className={styles.quote_text}>
                Error fetching quote 😢
              </q>
              <p id="author" className={styles.quote_author}>
                Please try reloading the page
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.quote_inner}>
            {isLoading ? (
              <div className={styles.spinner}></div>
            ) : (
              <div id="quote-wrapper" className={styles.quote_wrapper}>
                <q id="text" className={styles.quote_text}>
                  {quotes?.quoteText}
                </q>
                <p id="author" className={styles.quote_author}>
                  {quotes?.quoteAuthor}
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
                {genres?.map((genre: string, index: number) => (
                  <option key={`quotes_${index}`}>{genre}</option>
                ))}
              </select>
              <button
                onClick={handleRefetch}
                id="new-quote"
                className={styles.new_quote}
              >
                New Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QuoteBox;
