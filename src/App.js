import { useEffect, useRef, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [number, setNumber] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [option, setOption] = useState(30);

  const triggerRef = useRef(null);
  useEffect(() => {
    if (triggerRef.current) {
      const config = {
        rootMargin: "0px 0px 50px 0px",
        threshold: 0,
      };
      const container = triggerRef.current;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setNumber((prev) => prev + 1);
          }
        });
      }, config);
      observer.observe(container);
      return () => {
        observer.disconnect();
      };
    }
  }, []);
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/altkraft/for-applicants/master/frontend/titanic/passengers.json"
    )
      .then((response) => response.json())
      .then((json) =>
        setData(() => {
          return json
            .filter(({ name }) =>
              name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, option * number);
        })
      );
  }, [number, searchTerm, option]);

  return (
    <div className="app">
      <div className="search">
        <h3>Search</h3>
        <input
          placeholder="name..."
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setOption(e.target.value)}>
          {[30, 60, 90, 120].map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <h4>Items: {data.length}</h4>
        <h4>Pages loaded: {number}</h4>
        <button
          onClick={() => setNumber((prev) => (prev === 1 ? prev : prev - 1))}
        >
          Less
        </button>
      </div>

      <table>
        <tbody>
          <tr>
            <th>Name&Ticket</th>
            <th>Gender</th>
            <th>Survived</th>
            <th>Age&Cabin</th>
          </tr>
          {data.map((i) => (
            <tr key={i.id}>
              <td>
                {i.name} <br /> <span> ticket: {i.ticket} </span>
              </td>
              <td>{i.gender}</td>
              <td>{i.survived ? "live" : "dead"}</td>
              <td>
                age: {parseInt(i.age)} <br />
                {i.cabin && <span> cabin: {i.cabin} </span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={triggerRef}></div>
    </div>
  );
};

export default App;
