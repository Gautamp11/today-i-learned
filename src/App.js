import { useEffect, useState } from "react";
import { CATEGORIES } from "./utils/data";
import supabase from "./supabase";
import { addFact, updateFact } from "./api/apiFacts";
import {
  getVotedFacts,
  removeVotedFact,
  setVotedFact,
} from "./utils/voteUtils";

export default function App() {
  //states for fact form, facts, and filter
  const [isFactFormOpen, setIsFactFormOpen] = useState(false);
  const [facts, setFacts] = useState([]);
  const [filter, setFilter] = useState("all");

  // fetch facts on mount
  useEffect(function () {
    async function getFacts() {
      let { data: facts, error } = await supabase
        .from("facts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error);
      setFacts(facts);
    }
    getFacts();
  }, []);

  // handle fact form state 
  function handleFactFormOpen() {
    setIsFactFormOpen((prev) => !prev);
  }

  // filtering facts based on filter
  const filteredFacts = facts.filter((fact) => {
    return filter === "all" ? facts : fact.category === filter;
  });

  return (
    <div className="container">
    {/* passing fact form handler to link with share fact button */}
      <Header handleFactFormOpen={handleFactFormOpen} />

      {/* conditional rendering of fact form  */}
      {isFactFormOpen && (
        <NewFactForm
          setFacts={setFacts}
          handleFactFormOpen={handleFactFormOpen}
        />
      )}

      {/* app's main content */}
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

function NewFactForm({ setFacts, handleFactFormOpen }) {
  //states for text input, source, category and limiting text input
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLimit = 200;

  // fact submit handler
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
      handleFactFormOpen();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  // text input limit handler
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

//category filter section
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

//fact list section
function FactList({ filteredFacts, setFacts }) {
  // handling voting system
  async function handleVote(factId, voteType) {
    const votedFacts = getVotedFacts();

    const currentVote = votedFacts[factId];
    let incrementBy = 1;

    //if user already voted for this fact
    if (currentVote) {
      //clicked same button -> undo vote
      if (currentVote === voteType) {
        incrementBy = -1;
        removeVotedFact(factId);
      }

      //clicked different button -> switch vote
      else {
        //decrement old vote
        await updateFact(factId, currentVote, -1);
        setVotedFact(factId, voteType);
      }
    }
    //new vote
    else {
      setVotedFact(factId, voteType);
    }

    //update supabase
    const updatedFact = await updateFact(factId, voteType, incrementBy);

    setFacts((facts) =>
      facts.map((fact) =>
        fact.id === factId ? { ...fact, ...updatedFact[0] } : fact
      )
    );
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
                <button
                  onClick={() => handleVote(fact.id, "votesInteresting")}
                  style={{
                    backgroundColor:
                      getVotedFacts()[fact.id] === "votesInteresting"
                        ? "#15803d"
                        : "",
                  }}
                >
                  👍 {fact.votesInteresting}
                </button>
                <button
                  onClick={() => handleVote(fact.id, "votesMindblowing")}
                  style={{
                    backgroundColor:
                      getVotedFacts()[fact.id] === "votesMindblowing"
                        ? "#15803d"
                        : "",
                  }}
                >
                  🤯 {fact.votesMindblowing}
                </button>
                <button
                  onClick={() => handleVote(fact.id, "votesFalse")}
                  style={{
                    backgroundColor:
                      getVotedFacts()[fact.id] === "votesFalse"
                        ? "#15803d"
                        : "",
                  }}
                >
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
