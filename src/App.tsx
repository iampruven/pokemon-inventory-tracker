import "./App.css";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

interface Pokemon {
  name: string;
  url: string;
}
function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [offSet, setOffSet] = useState(0);
  const [count, setCount] = useState(0);
  const start = offSet + 1;
  const limit = 20;
  const end = offSet + limit;
  const [sorted, setSorted] = useState<"asc" | "desc" | null>(null);
  const [searchName, setSearchName] = useState("");
  const [modalStatus, setModalStatus] = useState(false);
  const [clickedPokemon, setClickedPokemon] = useState<string | null>(null);
  const [pokeStats,setPokeStats] = useState<any>(null);
  let alpha = "";
  if (sorted === "desc") {
    alpha = "a-z";
  } else if (sorted === "asc") {
    alpha = "z-a";
  }

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offSet}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data.results);
        setCount(data.count);
      })
      .catch((e) => console.log(e));
  }, [offSet]);

  const handleAlphabet = () => {
    if (!sorted) {
      setSorted("desc");
    } else if (sorted === "desc") {
      setSorted("asc");
    } else {
      setSorted(null);
    }
  };

  
  const handlePokemonClick = (pokemon: Pokemon) => {
    
    setClickedPokemon(pokemon.name);
    setModalStatus(true);
    fetch(pokemon.url)
      .then((res)=>res.json())
      .then((data)=>{
        setPokeStats(data)
      })
      .catch(e=>console.log(e))
  };
  console.log(pokemon);
  return (
    <>
      <button
        disabled={offSet > 0 ? false : true}
        onClick={() => {
          setOffSet(offSet - 20);
        }}
      >
        Previous
      </button>
      <button
        onClick={() => {
          console.log(offSet);
          setOffSet(offSet + 20);
        }}
      >
        Next
      </button>
      <p>
        Showing Pokemon {start}-{end} of {count} ({Math.ceil(count / limit)}{" "}
        pages)
      </p>
      <input
        type="text"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      {/* making loading page!!! */}
      {pokemon.length !== 0 ? (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th onClick={() => handleAlphabet()} className="pokeName">
                Name ({alpha})
              </th>
            </tr>
          </thead>
          <tbody>
            {[...pokemon]
              .filter((poke) => {
                if (
                  poke.name.toLowerCase().includes(searchName.toLowerCase())
                ) {
                  return true;
                }
                return false;
              })
              .sort((a, b) => {
             
                if (sorted === null) {
                  return 0; //0 do nothing?
                } else if (sorted === "desc") {
      
                  if (a.name < b.name) {
                    return -1;
                  }
                  if (a.name > b.name) {
                    return 1;
                  }
                } else if (sorted === "asc") {
                  if (a.name < b.name) {
                    return 1;
                  }
                  if (a.name > b.name) {
                    return -1;
                  }
                }
                return 0;
              })
              .map((pokemon, id) => (
                <tr key={id}>
                  <td>
                    <img src="https://via.placeholder.com/75" alt="pokemon" />
                  </td>
                  <td onClick={() => handlePokemonClick(pokemon)}>
                    {pokemon.name}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>loading pokemon...</p>
      )}

      <Dialog onClose={() => setModalStatus(false)} open={modalStatus}>
        <DialogTitle>{clickedPokemon} Stats!</DialogTitle>
        {pokeStats && <ul>
          {pokeStats.stats.map((traits:any, id:number) => <li key={id}>{traits.stat.name} {traits.base_stat}</li>)}
        </ul>}
      </Dialog>
    </>
  );
}

export default App;
