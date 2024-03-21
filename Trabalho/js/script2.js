const apiKey = 'e77306cf8091907388227d307b688187';
const baseURL = 'https://api.themoviedb.org/3';
const imageBaseURL = 'https://image.tmdb.org/t/p/w500';

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const movieTitle = decodeURIComponent(urlParams.get('title'));
const movieDetailsElement = document.getElementById('movie-details');

window.addEventListener('load', () => {
  if (urlParams.has('id')) {
    displayMovieDetails();
  } else {
    displayMovies();
  }
});

async function getMovies() {
  const response = await fetch(`${baseURL}/discover/movie?with_genres=16&with_companies=2&language=pt-BR&api_key=${apiKey}`);
  const data = await response.json();
  return data.results;
}

async function displayMovies() {
  const movies = await getMovies();
  const moviesElement = document.querySelector('.movies-container');

  moviesElement.innerHTML = '';

  const limitedMovies = movies.slice(0, 21);

  limitedMovies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const moviePoster = document.createElement('img');
    moviePoster.src = `${imageBaseURL}${movie.poster_path}`;
    moviePoster.alt = movie.title;
    moviePoster.classList.add('movie-poster');
    moviePoster.addEventListener('click', function () {
      showMovieDetails(movie.id);
    });

    const movieTitle = document.createElement('h2');
    movieTitle.textContent = movie.title;

    movieElement.appendChild(moviePoster);
    movieElement.appendChild(movieTitle);
    moviesElement.appendChild(movieElement);
  });
}

async function getMovieDetails(movieId) {
  const response = await fetch(`${baseURL}/movie/${movieId}?language=pt-BR&api_key=${apiKey}`);
  const data = await response.json();
  console.log(data);
  return data;
}

function showMovieDetails(movieId) {
  window.location.href = `filmes.html?id=${movieId}`;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href').substring(1);

    const targetElement = document.getElementById(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 70,
      behavior: 'smooth'
    });
  });
});

const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
navLinks.forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

async function displayMovieDetails() {
  const movieId = urlParams.get('id');

  const movieDetails = await getMovieDetails(movieId);
  const movieDetailsElement = document.getElementById('movie-details');

  movieDetailsElement.innerHTML = '';

  const titleElement = document.createElement('h1');
  titleElement.textContent = movieDetails.title;
  titleElement.classList.add('text-center', 'mb-4');

  const releaseDateElement = document.createElement('p');
  const releaseDate = new Date(movieDetails.release_date);
  const formattedReleaseDate = `${releaseDate.getDate().toString().padStart(2, '0')}/${(releaseDate.getMonth() + 1).toString().padStart(2, '0')}/${releaseDate.getFullYear()}`;
  releaseDateElement.textContent = `Data de Lançamento: ${formattedReleaseDate}`;
  releaseDateElement.classList.add('text-center', 'mb-4');

  const posterElement = document.createElement('img');
  posterElement.src = `${imageBaseURL}${movieDetails.poster_path}`;
  posterElement.alt = movieDetails.title;
  posterElement.classList.add('img-fluid', 'movie-poster');
  posterElement.addEventListener('click', function () {
    showMovieDetails(movieDetails.id);
  });

  const taglineElement = document.createElement('p');
  taglineElement.textContent = movieDetails.tagline;
  taglineElement.classList.add('text-center');

  const genresElement = document.createElement('p');
  genresElement.textContent = `Gêneros: ${movieDetails.genres.map(genre => genre.name).join(', ')}`;
  genresElement.classList.add('text-center', 'mb-4');

  const runtimeElement = document.createElement('p');
  const hours = Math.floor(movieDetails.runtime / 60);
  const minutes = movieDetails.runtime % 60;
  runtimeElement.textContent = `Duração: ${hours}h ${minutes}min`;
  runtimeElement.classList.add('text-center', 'mb-4');

  const overviewElement = document.createElement('h2');
  overviewElement.textContent = 'Sinopse';
  overviewElement.classList.add('text-center');

  const overviewTextElement = document.createElement('p');
  overviewTextElement.textContent = movieDetails.overview;
  overviewTextElement.classList.add('text-center');

  const productionCompaniesElement = document.createElement('p');
  productionCompaniesElement.textContent = `Companhias de Produção: ${movieDetails.production_companies.map(company => company.name).join(', ')}`;
  productionCompaniesElement.classList.add('text-center', 'mb-4');
  movieDetailsElement.appendChild(titleElement);
  movieDetailsElement.appendChild(releaseDateElement);
  movieDetailsElement.appendChild(taglineElement);
  movieDetailsElement.appendChild(posterElement);
  movieDetailsElement.appendChild(genresElement);
  movieDetailsElement.appendChild(runtimeElement);
  movieDetailsElement.appendChild(overviewElement);
  movieDetailsElement.appendChild(overviewTextElement);
  movieDetailsElement.appendChild(productionCompaniesElement);

  const videosResponse = await fetch(`${baseURL}/movie/${movieId}/videos?language=pt-BR&api_key=${apiKey}`);
  const videosData = await videosResponse.json();

  const trailerVideos = videosData.results.filter(video => video.type === 'Trailer');

  if (trailerVideos.length > 0) {
    const trailerKey = trailerVideos[0].key;
    const trailerElement = document.createElement('iframe');
    trailerElement.src = `https://www.youtube.com/embed/${trailerKey}`;
    trailerElement.width = '560';
    trailerElement.height = '315';
    trailerElement.allowFullscreen = true;
    trailerElement.classList.add('mb-4');

    movieDetailsElement.appendChild(trailerElement);
  } else {
    const noTrailerElement = document.createElement('p');
    noTrailerElement.textContent = 'Trailer não disponível!';
    noTrailerElement.classList.add('text-center', 'mb-4');
    movieDetailsElement.appendChild(noTrailerElement);
  }
}

document.getElementById('goToHomeButton').addEventListener('click', function() {
    window.location.href = 'index.html';
  });