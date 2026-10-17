
import { useEffect, useState } from "react";
import "./App.css";

const destinations = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    category: "Beach",
    description: "Discover tropical beaches, beautiful temples and lush green landscapes.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Nature",
    description: "Explore breathtaking mountains, alpine villages and scenic trails.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Kyoto",
    country: "Japan",
    category: "Culture",
    description: "Experience traditional Japanese streets, gardens and historic temples.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Santorini",
    country: "Greece",
    category: "Beach",
    description: "Enjoy whitewashed houses, blue domes and stunning sea views.",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Paris",
    country: "France",
    category: "Culture",
    description: "Explore famous landmarks, charming streets and world-class art.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Bali Forest",
    country: "Indonesia",
    category: "Nature",
    description: "Find peaceful tropical forests, waterfalls and lush green scenery.",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=900",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Tokyo",
    country: "Japan",
    category: "Culture",
    description: "Discover neon-lit streets, anime culture, incredible food and peaceful shrines.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900",
    rating: 4.9,
  },
  {
    id: 8,
    name: "Goa",
    country: "India",
    category: "Beach",
    description: "Relax on sunny beaches, explore Portuguese heritage and enjoy coastal food.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900",
    rating: 4.7,
  },
  {
    id: 9,
    name: "Manali",
    country: "India",
    category: "Adventure",
    description: "Experience Himalayan views, mountain roads, snow and outdoor adventures.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900",
    rating: 4.8,
  },
  {
    id: 10,
    name: "Dubai",
    country: "United Arab Emirates",
    category: "Adventure",
    description: "See futuristic skyscrapers, explore desert dunes and discover spectacular attractions.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900",
    rating: 4.8,
  },
  {
    id: 11,
    name: "Maldives",
    country: "Maldives",
    category: "Beach",
    description: "Escape to turquoise lagoons, coral reefs and beautiful island resorts.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900",
    rating: 4.9,
  },
  {
    id: 12,
    name: "Iceland",
    country: "Iceland",
    category: "Nature",
    description: "Explore waterfalls, volcanic landscapes, glaciers and the Northern Lights.",
    image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=900",
    rating: 4.8,
  },
  {
    id: 13,
    name: "Singapore",
    country: "Singapore",
    category: "Culture",
    description: "Discover futuristic gardens, vibrant neighbourhoods and amazing street food.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900",
    rating: 4.7,
  },
  {
    id: 14,
    name: "New York",
    country: "United States",
    category: "Culture",
    description: "Experience iconic skyscrapers, lively neighbourhoods, museums and Central Park.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900",
    rating: 4.8,
  },
];

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function App() {
  const [page, setPage] = useState("Explore");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const [liveDestinations, setLiveDestinations] = useState([]);
  const [apiStatus, setApiStatus] = useState("idle");

  const [trip, setTrip] = useState(() =>
    readStorage("tripwise-trip")
  );

  const [favourites, setFavourites] = useState(() =>
    readStorage("tripwise-favourites")
  );

  const [days, setDays] = useState(3);
  const [dailyBudget, setDailyBudget] = useState(3000);

  useEffect(() => {
    localStorage.setItem("tripwise-trip", JSON.stringify(trip));
  }, [trip]);

  useEffect(() => {
    localStorage.setItem(
      "tripwise-favourites",
      JSON.stringify(favourites)
    );
  }, [favourites]);

  // Search Wikipedia for real destination-related articles.
  useEffect(() => {
    const query = search.trim();

    if (query.length < 3) {
      setLiveDestinations([]);
      setApiStatus("idle");
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setApiStatus("loading");

      try {
        const params = new URLSearchParams({
          action: "query",
          generator: "search",
          gsrnamespace: "0",
          gsrlimit: "8",
          gsrsearch: query,
          prop: "pageimages|extracts",
          piprop: "thumbnail",
          pithumbsize: "700",
          exintro: "1",
          explaintext: "1",
          format: "json",
          origin: "*",
        });

        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load live results");
        }

        const data = await response.json();

        const results = Object.values(
          data.query?.pages || {}
        ).map((item) => ({
          id: `wiki-${item.pageid}`,
          name: item.title,
          country: "Explore worldwide",
          category: "Culture",
          description:
            item.extract?.slice(0, 240) ||
            "Discover more about this place.",
          image:
            item.thumbnail?.source ||
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900",
          rating: null,
          source: "Wikipedia",
          articleUrl: `https://en.wikipedia.org/?curid=${item.pageid}`,
        }));

        setLiveDestinations(results);
        setApiStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          setLiveDestinations([]);
          setApiStatus("error");
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  const allDestinations = [
    ...destinations,
    ...liveDestinations.filter(
      (live) =>
        !destinations.some(
          (place) =>
            place.name.toLowerCase() ===
            live.name.toLowerCase()
        )
    ),
  ];

  const filtered = allDestinations
    .filter((place) => {
      const text = search.toLowerCase();

      const matchesSearch =
        place.name.toLowerCase().includes(text) ||
        place.country.toLowerCase().includes(text) ||
        place.description.toLowerCase().includes(text);

      const matchesCategory =
        category === "All" || place.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "Name A-Z") {
        return a.name.localeCompare(b.name);
      }

      if (sort === "Rating") {
        return (b.rating || 0) - (a.rating || 0);
      }

      return String(a.id).localeCompare(
        String(b.id),
        undefined,
        { numeric: true }
      );
    });

  function addToTrip(place) {
    if (trip.some((item) => item.id === place.id)) {
      setMessage(`${place.name} is already in your trip.`);
      return;
    }

    setTrip((previous) => [...previous, place]);
    setMessage(`${place.name} added to your trip!`);
  }

  function removeFromTrip(id) {
    setTrip((previous) =>
      previous.filter((place) => place.id !== id)
    );
    setMessage("Destination removed from your trip.");
  }

  function toggleFavourite(place) {
    const exists = favourites.some(
      (item) => item.id === place.id
    );

    if (exists) {
      setFavourites((previous) =>
        previous.filter((item) => item.id !== place.id)
      );
      setMessage(`${place.name} removed from favourites.`);
    } else {
      setFavourites((previous) => [...previous, place]);
      setMessage(`${place.name} saved to favourites!`);
    }
  }

  function isFavourite(place) {
    return favourites.some((item) => item.id === place.id);
  }

  function changePage(nextPage) {
    setPage(nextPage);
    setSelected(null);
    setMessage("");
  }

  function surpriseMe() {
    const pool = allDestinations.filter(
      (place) => !trip.some((item) => item.id === place.id)
    );

    if (pool.length === 0) {
      setMessage("You've added every available place to your trip!");
      return;
    }

    const randomPlace =
      pool[Math.floor(Math.random() * pool.length)];

    setSelected(randomPlace);
    setMessage("");
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setSort("Popular");
  }

  function renderDestinationCard(place, mode = "explore") {
    const inTrip = trip.some((item) => item.id === place.id);
    const favourite = isFavourite(place);

    return (
      <article className="destination-card" key={place.id}>
        <div className="image-button">
          <button
            className="card-image-link"
            onClick={() => setSelected(place)}
            aria-label={`View ${place.name} details`}
          >
            <img
              src={place.image}
              alt={place.name}
              loading="lazy"
            />
          </button>

          <span className="category-tag">{place.category}</span>

          <button
            className="favorite-button"
            onClick={() => toggleFavourite(place)}
            aria-label={
              favourite
                ? "Remove from favourites"
                : "Add to favourites"
            }
            title={
              favourite
                ? "Remove from favourites"
                : "Add to favourites"
            }
          >
            {favourite ? "♥" : "♡"}
          </button>
        </div>

        <div className="card-content">
          <div className="card-title-row">
            <div>
              <h3>{place.name}</h3>
              <p className="location">{place.country}</p>
            </div>

            {place.rating && (
              <span className="rating">★ {place.rating}</span>
            )}
          </div>

          <p className="card-description">
            {place.description}
          </p>

          {place.source && (
            <p className="location">
              Source: {place.source}
            </p>
          )}

          <div className="card-actions">
            <button
              className="text-button"
              onClick={() => setSelected(place)}
            >
              View details →
            </button>

            {mode === "trip" ? (
              <button
                className="remove-button"
                onClick={() => removeFromTrip(place.id)}
              >
                Remove
              </button>
            ) : mode === "favourites" ? (
              <button
                className="remove-button"
                onClick={() => toggleFavourite(place)}
              >
                Unsave ♥
              </button>
            ) : (
              <button
                className="add-button"
                onClick={() => addToTrip(place)}
                disabled={inTrip}
              >
                {inTrip ? "Added ✓" : "+ Add"}
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  const budgetTotal = Number(days) * Number(dailyBudget);

  return (
    <div className="app">
      <header className="navbar">
        <button
          className="brand"
          onClick={() => changePage("Explore")}
        >
          <span className="brand-icon">✳</span>
          TripWise
        </button>

        <nav>
          <button
            className={
              page === "Explore" ? "nav-link active" : "nav-link"
            }
            onClick={() => changePage("Explore")}
          >
            Explore
          </button>

          <button
            className={
              page === "Favourites"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => changePage("Favourites")}
          >
            Favourites ♥
            <span className="trip-count">{favourites.length}</span>
          </button>

          <button
            className={
              page === "My Trip" ? "nav-link active" : "nav-link"
            }
            onClick={() => changePage("My Trip")}
          >
            My Trip
            <span className="trip-count">{trip.length}</span>
          </button>
        </nav>

        <span className="nav-note">
          Your next adventure starts here.
        </span>
      </header>

      <main>
        {selected ? (
          <section className="details-page">
            <button
              className="back-button"
              onClick={() => setSelected(null)}
            >
              ← Back to destinations
            </button>

            <img
              className="details-image"
              src={selected.image}
              alt={selected.name}
            />

            <div className="details-info">
              <span className="eyebrow">{selected.category}</span>
              <h1>{selected.name}</h1>
              <p className="location">⌖ {selected.country}</p>
              <p>{selected.description}</p>

              {selected.rating && (
                <p>★ {selected.rating} traveller rating</p>
              )}

              {selected.source && (
                <p>
                  Destination information: {selected.source}
                </p>
              )}

              {selected.articleUrl && (
                <p>
                  <a
                    href={selected.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read more about {selected.name} ↗
                  </a>
                </p>
              )}

              <div className="card-actions">
                <button
                  className="primary-button"
                  onClick={() => addToTrip(selected)}
                >
                  + Add to My Trip
                </button>

                <button
                  className="secondary-button"
                  onClick={() => toggleFavourite(selected)}
                >
                  {isFavourite(selected)
                    ? "♥ Saved"
                    : "♡ Save favourite"}
                </button>
              </div>

              {message && <p className="feedback">{message}</p>}
            </div>
          </section>
        ) : page === "Explore" ? (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">
                  YOUR WORLD, YOUR WAY
                </span>

                <h1>
                  Collect moments.
                  <br />
                  <span>Not just places.</span>
                </h1>

                <p>
                  Discover incredible destinations, find your next
                  adventure and bring your travel plans together.
                </p>

                <div className="hero-actions">
                  <button
                    className="hero-button"
                    onClick={() =>
                      document
                        .getElementById("destinations")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Explore destinations ↓
                  </button>

                  <button
                    className="secondary-button"
                    onClick={surpriseMe}
                  >
                    ✨ Surprise me
                  </button>
                </div>
              </div>
            </section>

            <section
              className="explore-section"
              id="destinations"
            >
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    FIND YOUR NEXT ESCAPE
                  </span>
                  <h2>Explore destinations</h2>
                  <p>
                    From hidden escapes to famous landmarks.
                  </p>
                </div>

                <span className="result-count">
                  {filtered.length} places
                </span>
              </div>

              <div className="filters">
                <input
                  type="search"
                  placeholder="⌕ Search places or countries..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  aria-label="Filter by category"
                >
                  <option value="All">All categories</option>
                  <option value="Beach">Beach</option>
                  <option value="Nature">Nature</option>
                  <option value="Culture">Culture</option>
                  <option value="Adventure">Adventure</option>
                </select>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort destinations"
                >
                  <option value="Popular">Default order</option>
                  <option value="Name A-Z">Name A–Z</option>
                  <option value="Rating">Highest rated</option>
                </select>

                <button
                  className="secondary-button"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>

              {message && <p className="feedback">{message}</p>}

              {apiStatus === "loading" && (
                <p className="feedback">
                  Discovering destinations from Wikipedia...
                </p>
              )}

              {apiStatus === "error" && (
                <p className="feedback">
                  Live search is unavailable right now. Your featured
                  destinations are still available.
                </p>
              )}

              {apiStatus === "success" &&
                search.trim().length >= 3 && (
                  <p className="feedback">
                    Live search results are powered by Wikipedia.
                  </p>
                )}

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <h3>No destinations found</h3>
                  <p>
                    Try another search or change your filters.
                  </p>
                  <button
                    className="secondary-button"
                    onClick={resetFilters}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="destination-grid">
                  {filtered.map((place) =>
                    renderDestinationCard(place)
                  )}
                </div>
              )}
            </section>
          </>
        ) : page === "Favourites" ? (
          <section className="explore-section trip-page">
            <span className="eyebrow">YOUR TRAVEL WISHLIST</span>
            <h1>Favourite destinations ♥</h1>
            <p className="section-subtitle">
              Keep the places you dream of visiting close at hand.
            </p>

            {message && <p className="feedback">{message}</p>}

            {favourites.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">♡</div>
                <h2>No favourites yet.</h2>
                <p>
                  Save destinations using the heart button to build
                  your personal travel wishlist.
                </p>
                <button
                  className="primary-button"
                  onClick={() => changePage("Explore")}
                >
                  Explore places
                </button>
              </div>
            ) : (
              <div className="destination-grid">
                {favourites.map((place) =>
                  renderDestinationCard(place, "favourites")
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="explore-section trip-page">
            <span className="eyebrow">YOUR PERSONAL COLLECTION</span>
            <h1>My Trip</h1>
            <p className="section-subtitle">
              Every great journey starts with a place.
            </p>

            {message && <p className="feedback">{message}</p>}

            {trip.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✳</div>
                <h2>Your adventure is waiting.</h2>
                <p>
                  You haven't saved any destinations yet. Find a place
                  that inspires you and add it to your trip.
                </p>
                <button
                  className="primary-button"
                  onClick={() => changePage("Explore")}
                >
                  Discover places
                </button>
              </div>
            ) : (
              <>
                <div className="trip-summary">
                  <strong>
                    {trip.length} destination
                    {trip.length === 1 ? "" : "s"} saved
                  </strong>

                  <button
                    className="text-button"
                    onClick={() => changePage("Explore")}
                  >
                    + Discover more
                  </button>

                  <button
                    className="remove-button"
                    onClick={() => {
                      setTrip([]);
                      setMessage("Your trip has been cleared.");
                    }}
                  >
                    Clear trip
                  </button>
                </div>

                <div className="budget-panel">
                  <span className="eyebrow">TRIP PLANNER</span>
                  <h2>Estimate your budget</h2>
                  <p>
                    Set your trip duration and estimated daily spending
                    to calculate a simple budget.
                  </p>

                  <div className="budget-controls">
                    <label>
                      Trip duration (days)
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={days}
                        onChange={(event) =>
                          setDays(
                            Math.max(
                              1,
                              Math.min(365, Number(event.target.value) || 1)
                            )
                          )
                        }
                      />
                    </label>

                    <label>
                      Daily budget (₹)
                      <input
                        type="number"
                        min="0"
                        value={dailyBudget}
                        onChange={(event) =>
                          setDailyBudget(
                            Math.max(0, Number(event.target.value) || 0)
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="budget-total">
                    <span>Estimated total</span>
                    <strong>
                      ₹{budgetTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <p className="location">
                    This is your own estimate, not a live travel quote.
                    Flights, accommodation and activities may cost extra.
                  </p>
                </div>

                <h2 className="trip-list-heading">
                  Your destinations
                </h2>

                <div className="destination-grid">
                  {trip.map((place) =>
                    renderDestinationCard(place, "trip")
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <footer>
        <button
          className="brand footer-brand"
          onClick={() => changePage("Explore")}
        >
          <span className="brand-icon">✳</span>
          TripWise
        </button>

        <p>Find your place in the world.</p>
        <p className="footer-note">
          Discover · Save · Plan · Explore
        </p>
      </footer>
    </div>
  );
}

export default App;

