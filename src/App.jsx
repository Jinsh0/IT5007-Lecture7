async function fetchGraphQLData(url, query, variables={}) {
	const response = await fetch(url, {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		// Below here should also be used to write the API key, find out the header name, and the API key got it from vendor
		// Add any additional headers here (e.g., Authorization for protected endpoints)
	  },
	  body: JSON.stringify({
		query,
		// variables: {}, // Uncomment and use if your query requires variables
	  }),
	});
  
	if (!response.ok) {
	  throw new Error(`Network response was not ok: ${response.statusText}`);
	}
  
	const resultjson = await response.json();
	//console.log(resultjson)
	return resultjson.data
  }

class GraphQL_API_Lecture7 extends React.Component {

	  constructor()
	  {
		super();
		this.state = {anime: []}
	  }

	  componentDidMount()
	  {
		//typically we dont call the fetchGraphQLData inside here directly, here is more generic
		this.loadData()
	  }

	  async loadData()
	  {

		const query = `{
			Page {
			  media {
				siteUrl
				title {
				  english
				  native
				}
				description
			  }
			}
		  }`;

		const data = await fetchGraphQLData ("https://graphql.anilist.co", query)
		console.log(data.Page.media)
		var listofanime = []
		//data.Page.media.forEach ( item => {console.log(item.title.english)})
		data.Page.media.forEach ( item => {listofanime.push(item.title.english)})
		this.setState({anime: listofanime})
	  }

	  render() {
		      const systemname = "IT5007 Bug Tracker";
		      return (
			            <div>
							<h1>GraphQL API Test</h1>
							{/*DOM in the React need unique key, otherwise some broswer will not render it, and throw error*/}
							{/*if you write item without curly bracket, it will treated as string, and print item multiple times*/}
							{this.state.anime.map( (item, pos) => <p key={pos}> {item} </p> )}
						</div>
			          );
		    }
}

const element = <GraphQL_API_Lecture7 />;

ReactDOM.render(element, document.getElementById('contents'));
