import { useEffect, useState } from "react";
import { CATEGORIES } from "./utils/data";
import supabase from "./supabase";
import { addFact, updateFact } from "./api/apiFacts";

export default function App() {
  const [isFactFormOpen, setIsFactFormOpen] = useState(false);
  const [facts, setFacts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(function () {
    async function getFacts() {
      let { data: facts, error } = await supabase.from("facts").select("*");
      if (error) throw new Error(error);
      setFacts(facts);
    }
    getFacts();
  }, []);

  function handleFactFormOpen() {
    setIsFactFormOpen((prev) => !prev);
  }

  const filteredFacts = facts.filter((fact) => {
    return filter === "all" ? facts : fact.category === filter;
  });

  return (
    <div className="container">
      <Header handleFactFormOpen={handleFactFormOpen} />
      {isFactFormOpen && <NewFactForm setFacts={setFacts} />}
      <main className="main">
        <CategoryFilter setFilter={setFilter} />
        <FactList filteredFacts={filteredFacts} setFacts={setFacts} />
      </main>
    </div>
  );
}

function Header({ handleFactFormOpen }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="logo" />
        <h1>Today I Learned</h1>
      </div>
      <button className="btn btn-large share-fact" onClick={handleFactFormOpen}>
        Share a fact
      </button>
    </header>
  );
}

function NewFactForm({ setFacts }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLimit = 200;

  async function handleSubmit(e) {
    e.preventDefault();

    const newFact = {
      text,
      source,
      category,
      votesInteresting: 0,
      votesMindblowing: 0,
      votesFalse: 0,
    };
    try {
      const data = await addFact(newFact);
      setFacts((facts) => [...facts, data[0]]);
      setText("");
      setSource("");
      setCategory("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  function handleTextChange(e) {
    const newText = e.target.value;
    if (newText.length <= textLimit) {
      setText(newText);
    }
  }
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world"
        value={text}
        onChange={handleTextChange}
      />
      <span>{textLimit - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category</option>
        {CATEGORIES.filter((category) => category.name !== "all").map(
          (category) => (
            <option value={category.name} key={category.name}>
              {category.name}
            </option>
          )
        )}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter({ setFilter }) {
  return (
    <aside>
      <ul>
        {CATEGORIES.map((category) => (
          <li className="category" key={category.name}>
            <button
              className="btn btn-category"
              style={{ backgroundColor: `${category.color}` }}
              onClick={() => setFilter(category.name)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ filteredFacts, setFacts }) {
  async function handleVote(factId, voteType) {
    try {
      const updatedFact = await updateFact(factId, voteType);

      setFacts((facts) =>
        facts.map((fact) =>
          fact.id === factId ? { ...fact, ...updatedFact[0] } : fact
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="fact-container">
      {filteredFacts.length > 0 ? (
        <ul>
          {filteredFacts.map((fact) => (
            <li className="fact" key={fact.id}>
              <p>
                {fact.text}
                <a
                  href={fact.source}
                  target="_blank"
                  className="source "
                  rel="noreferrer"
                >
                  Source
                </a>
              </p>
              <span
                className="tag"
                style={{
                  backgroundColor: `${
                    CATEGORIES.find(
                      (category) => category.name === fact.category
                    )?.color
                  }
                  `,
                }}
              >
                {fact.category}
              </span>
              <div className="vote-buttons">
                <button onClick={() => handleVote(fact.id, "votesInteresting")}>
                  👍 {fact.votesInteresting}
                </button>
                <button onClick={() => handleVote(fact.id, "votesMindblowing")}>
                  🤯 {fact.votesMindblowing}
                </button>
                <button onClick={() => handleVote(fact.id, "votesFalse")}>
                  ❌ {fact.votesFalse}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h2>No Facts found under this catgeory</h2>
      )}
    </section>
  );
}
