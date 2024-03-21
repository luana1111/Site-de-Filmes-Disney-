const apiKey = 'e77306cf8091907388227d307b688187';
const baseURL = 'https://api.themoviedb.org/3';
const imageBaseURL = 'https://image.tmdb.org/t/p/w500';
const moviesElement = document.querySelector('.movies-container');

async function getAllMovies() {
  const response = await fetch(`${baseURL}/discover/movie?with_companies=2&language=pt-BR&api_key=${apiKey}`);
  const data = await response.json();
  return data.results;
}

async function displayAllMovies() {
  const allMovies = await getAllMovies();

  moviesElement.innerHTML = '';

  allMovies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const moviePoster = document.createElement('img');
    moviePoster.src = `${imageBaseURL}${movie.poster_path}`;
    moviePoster.alt = movie.title;
    moviePoster.classList.add('movie-poster');
    moviePoster.addEventListener('click', function () {
      window.location.href = `filmes.html?id=${movie.id}`;
    });

    movieElement.appendChild(moviePoster);
    moviesElement.appendChild(movieElement);
  });
}

window.addEventListener('load', () => {
  displayAllMovies(); // Exibir todos os filmes da API no catálogo
});
