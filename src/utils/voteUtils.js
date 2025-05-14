export function getVotedFacts() {
  const votedFacts = localStorage.getItem("votedFacts");
  return votedFacts ? JSON.parse(votedFacts) : {};
}

export function setVotedFact(factId, voteType) {
  const votedFacts = getVotedFacts();
  votedFacts[factId] = voteType;
  localStorage.setItem("votedFacts", JSON.stringify(votedFacts));
}

export function removeVotedFact(factId) {
  const votedFacts = getVotedFacts();
  delete votedFacts[factId];
  localStorage.setItem("votedFacts", JSON.stringify(votedFacts));
}
