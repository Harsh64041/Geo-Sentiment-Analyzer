import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line, Bar } from 'react-chartjs-2'; // Re-add 'Bar'
import GeoChart from './GeoChart'; 
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Re-add 'BarElement'
} from 'chart.js';

// Register all components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement // Re-add 'BarElement'
);

const API_URL = 'http://localhost:5000/api'; 

function Dashboard({ topic, onSearch }) { 
  const [pieChartData, setPieChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null); 
  const [barChartData, setBarChartData] = useState(null); // Re-add Bar Chart state
  const [articles, setArticles] = useState([]);
  const [geoData, setGeoData] = useState([]); 
  const [keyPhrases, setKeyPhrases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!topic) return;

      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/topics/${topic}`);
        const data = res.data;

        if (data.length === 0) {
            setPieChartData(null);
            setLineChartData(null); 
            setBarChartData(null); // Reset bar chart
            setArticles([]); 
            setGeoData([]);
            setIsLoading(false);
            return;
        }

        // --- 1. Process for Pie Chart (Sentiment) ---
        const sentimentCounts = data.reduce((acc, item) => {
          acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
          return acc;
        }, {});
        const pieData = {
          labels: Object.keys(sentimentCounts),
          datasets: [ {
            label: 'Sentiment Analysis',
            data: Object.values(sentimentCounts),
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)', // POSITIVE
              'rgba(255, 99, 132, 0.6)', // NEGATIVE
              'rgba(255, 206, 86, 0.6)', // NEUTRAL
            ],
          } ],
        };
        setPieChartData(pieData);


        // --- 2. Process for Key Phrases List ---
        const allPhrases = data.flatMap(item => item.keyPhrases);
        const phraseCounts = allPhrases.reduce((acc, phrase) => {
            acc[phrase] = (acc[phrase] || 0) + 1;
            return acc;
        }, {});
        const sortedPhrases = Object.entries(phraseCounts)
                                    .sort(([,a],[,b]) => b-a)
                                    .slice(0, 5); // Show Top 5
        setKeyPhrases(sortedPhrases);

        // --- 3. Process for Line Chart (Sentiment Over Time) ---
        const sortedData = data.sort((a, b) => 
            new Date(a.date.split('_')[0]) - new Date(b.date.split('_')[0])
        );
        const lineData = {
          labels: sortedData.map(item => 
            new Date(item.date.split('_')[0]).toLocaleDateString() 
          ),
          datasets: [ {
              label: 'Sentiment Score Over Time',
              data: sortedData.map(item => item.rawSentimentScore), 
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            } ],
        };
        setLineChartData(lineData);

        // --- 4. Process for Bar Chart (Top Sources) ---
        const domainCounts = data.reduce((acc, item) => {
          if (item.domain) { 
            acc[item.domain] = (acc[item.domain] || 0) + 1;
          }
          return acc;
        }, {});
        const sortedDomains = Object.entries(domainCounts)
                                     .sort(([,a],[,b]) => b-a)
                                     .slice(0, 5); // Get top 5
        
        const barData = {
          labels: sortedDomains.map(([domain]) => domain),
          datasets: [ {
              label: '# of Articles',
              data: sortedDomains.map(([,count]) => count),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        };
        setBarChartData(barData); 

        // --- 5. Get Top 5 Articles ---
        setArticles(data.slice(0, 5));

        // --- 6. Process for Geo Heatmap ---
        const countryCounts = data.reduce((acc, item) => {
          if (item.sourcecountry) { 
            acc[item.sourcecountry] = (acc[item.sourcecountry] || 0) + 1;
          }
          return acc;
        }, {});
        const geoChartData = Object.entries(countryCounts).map(([country, count]) => ({
          country,
          count
        }));
        setGeoData(geoChartData); 

      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [topic]); 

  if (isLoading) return <p>Loading dashboard...</p>;
  if (!pieChartData) return <p>No data found for "{topic}". Try analyzing it first.</p>;

  // This layout uses a new CSS class "dashboard-grid"
  return (
    <div className="dashboard">
      <h2>Dashboard for: {topic}</h2>
      
      {/* This new grid handles the top-row layout */}
      <div className="dashboard-grid">
        
        {/* Column 1: Pie and Phrases */}
        <div className="grid-column-left">
          <div className="chart-pie card">
            <h3>Sentiment Breakdown</h3>
            <Pie data={pieChartData} />
          </div>
          <div className="key-phrases card">
            <h3>Top Key Phrases (Click to search)</h3>
            <ul>
              {keyPhrases.map(([phrase, count]) => (
                <li key={phrase}>
                  <button 
                    className="key-phrase-button" 
                    onClick={() => onSearch(phrase)}
                  >
                    {phrase}
                  </button>
                  <span>({count} mentions)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 2: Bar Chart and Article List */}
        <div className="grid-column-right">
          <div className="chart-bar card">
            <h3>Top 5 News Sources</h3>
            <Bar data={barChartData} />
          </div>
          <div className="article-list card">
            <h3>Top Article Headlines</h3>
            <ul>
              {articles.map((article) => (
                <li key={article.articleId} className="article-item">
                  <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {article.title}
                    <span>{article.domain}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div> {/* End of dashboard-grid */}

      {/* These 2 items will span the full width below the grid */}
      <div className="chart-line card">
        <h3>Sentiment Over Time</h3>
        <Line data={lineChartData} />
      </div>
      
      <div className="chart-map card">
        <h3>Article Origin by Country</h3>
        <GeoChart data={geoData} />
      </div>

    </div>
  );
}

export default Dashboard;