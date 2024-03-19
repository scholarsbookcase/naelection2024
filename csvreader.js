document.addEventListener('DOMContentLoaded', function() {
  // Get the 'file' query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const csvFilePath = urlParams.get('file'); // 'file' is the name of the query parameter

  if (csvFilePath) {
    fetch(csvFilePath)
      .then(response => response.text())
      .then(csvString => {
      	const data = Papa.parse(csvString, { header: true, skipEmptyLines: true }).data; // Ensure empty lines are skipped
        let tableHtml = "<table class='small-font-table'>";
        const headers = Object.keys(data[0]);
        
        // Generate table headers
        tableHtml += "<tr>";
        headers.forEach(header => {
            tableHtml += `<th>${header}</th>`;
        });
        tableHtml += "</tr>";
        
        // Generate table rows
        data.forEach(row => {
            if (row && Object.keys(row).length) { // Check if row is defined and has data
                tableHtml += "<tr>";
                headers.forEach(header => {
                    let cellContent = row[header];
                    // Ensure cellContent is defined to avoid 'undefined' values
                    if (cellContent) {
                        // Check if the cell is in 'URL' column and not 'NA'
                        if (header === 'URL' && cellContent !== 'NA') {
                            // Make the content a clickable link
                            cellContent = `<a href="${cellContent}" target="_blank">여심위 등재 사항 자세히 보기</a>`;
                        } else if (cellContent === 'NA') {
                            // Replace 'NA' with a blank space
                            cellContent = '';
                        }
                    } else {
                        // If cellContent is undefined or empty, ensure it is set to an empty string
                        cellContent = '';
                    }
                    tableHtml += `<td>${cellContent}</td>`;
                });
                tableHtml += "</tr>";
            }
        });
        tableHtml += "</table>";
        document.body.innerHTML += tableHtml; // Append the table to the body or a specific element
        // ... existing code to parse CSV and generate table ...
        // Make sure to use the 'csvFilePath' variable where necessary
      })
      .catch(error => {
        console.error('Error loading the CSV file:', error);
        // Handle errors, such as displaying a user-friendly message
      });
  } else {
    // Handle the case where 'file' parameter is not provided
    console.error('No CSV file specified.');
    // You might want to display a message to the user or redirect them
  }
})
