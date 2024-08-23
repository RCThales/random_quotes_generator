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
        .get(`https://api.quotable.io/random?tags=${activeGenre}`)
        .then((res) => {
          return res.data;
        }),
  });

  const handleRefetch = () => {
    refetchQuotes();
  };

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    staleTime: Infinity,
    queryFn: () =>
      axios.get(`https://api.quotable.io/tags`).then((res) => {
        return res.data;
      }),
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
      const response = await axios.get("https://loremflickr.com/600/400");
      setBackgroundImageUrl(response.request.responseURL);
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
                  {quotes?.content}
                </q>
                <p id="author" className={styles.quote_author}>
                  {quotes?.author}
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
                {genres?.map(
                  (genre: any, index: number) =>
                    genre.quoteCount > 0 && (
                      <option key={`quotes_${index}`}>{genre.name}</option>
                    )
                )}
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
