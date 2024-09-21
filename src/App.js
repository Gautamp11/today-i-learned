import { useEffect, useState } from "react";
import { CATEGORIES } from "./utils/data";
import { initialFacts } from "./utils/data";

export default function App() {
  const [isFactFormOpen, setIsFactFormOpen] = useState(false);

  function handleFactFormOpen() {
    setIsFactFormOpen((prev) => !prev);
  }

  return (
    <div className="container">
      <Header handleFactFormOpen={handleFactFormOpen} />

      {isFactFormOpen && <NewFactForm />}
      <main class="main">
        <CategoryFilter />
        <FactList />
      </main>
    </div>
  );
}

function Header({ handleFactFormOpen }) {
  return (
    <header class="header">
      <div class="logo">
        <img src="logo.png" alt="logo" />
        <h1>Today I Learned</h1>
      </div>
      <button class="btn btn-large share-fact" onClick={handleFactFormOpen}>
        Share a fact
      </button>
    </header>
  );
}

function NewFactForm() {
  return (
    <form class="fact-form">
      <input type="text" placeholder="Share a fact with the world" />
      <span>200</span>
      <input type="text" placeholder="Trustworthy source" />
      <select>
        <option value="">Choose category</option>
        <option value="tech">Tech</option>
        <option value="history">History</option>
      </select>
      <button class="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        {CATEGORIES.map((category) => (
          <li className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: `${category.color}` }}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList() {
  const [facts, setFacts] = useState([]);

  useEffect(function () {}, []);

  return (
    <section>
      <ul>
        {initialFacts.map((fact) => (
          <li class="fact">
            <p>
              {fact.text}
              <a
                href={fact.source}
                target="_blank"
                class="source "
                rel="noreferrer"
              >
                Source
              </a>
            </p>
            <span
              class="tag"
              style={{
                backgroundColor: `${
                  CATEGORIES.find((category) => category.name === fact.category)
                    ?.color
                }
                `,
              }}
            >
              {fact.category}
            </span>
            <div class="vote-buttons">
              <button>👍 {fact.votesInteresting}</button>
              <button>🤯 {fact.votesMindblowing}</button>
              <button>❌ {fact.votesFalse}</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
