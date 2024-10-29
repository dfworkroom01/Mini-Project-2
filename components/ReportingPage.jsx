import React, { useEffect, useState } from "react";
import axios from "axios";
import Logout from "./Logout";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const ReportingPage = () => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState(["AAPL"]);
  const [input, setInput] = useState("");
  const [showOnlyRevenue, setShowOnlyRevenue] = useState(false);

  const fetchTrendData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/financial-data",
        {
          params: { companies: companies.join(",") },
        }
      );
      const data = response.data;
      setTrendData(data);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendData();
  }, [companies]);

  const handleAddCompany = () => {
    if (input && !companies.includes(input)) {
      setCompanies((prev) => [...prev, input]);
      setInput(""); // Clear the input after adding
    }
  };

  // Handling loading and error states
  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Group data by year for each company
  const groupedData = {};
  trendData.forEach((item) => {
    const year = item.calendarYear || "N/A";
    if (!groupedData[item.company]) {
      groupedData[item.company] = {};
    }
    if (!groupedData[item.company][year]) {
      groupedData[item.company][year] = {
        revenue: 0,
        netIncome: 0,
      };
    }
    groupedData[item.company][year].revenue += item.revenue || 0;
    groupedData[item.company][year].netIncome += item.netIncome || 0;
  });

  return (
    <Container maxWidth="lg" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Financial Data NASDAQ
      </Typography>
      {/* Logout Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Logout />
      </Box>
      <Grid container spacing={2} justifyContent="center" mb={2}>
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            label="Add Company Symbol"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Button variant="contained" onClick={handleAddCompany} fullWidth>
            Add
          </Button>
        </Grid>
      </Grid>
      <FormControlLabel
        control={
          <Checkbox
            checked={showOnlyRevenue}
            onChange={(e) => setShowOnlyRevenue(e.target.checked)}
            color="primary"
          />
        }
        label="Show Only Revenue Data"
      />
      {companies.map((company) => {
        const companyYears = groupedData[company]
          ? Object.keys(groupedData[company])
          : [];

        return (
          <Card variant="outlined" style={{ marginTop: "16px" }} key={company}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                2019-2023 Total Revenue & Net Income Data for {company}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Revenue</TableCell>
                    {!showOnlyRevenue && <TableCell>Net Income</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companyYears.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={showOnlyRevenue ? 1 : 2}
                        align="center"
                      >
                        No data available for this company.
                      </TableCell>
                    </TableRow>
                  ) : (
                    companyYears.map((year) => {
                      const { revenue, netIncome } = groupedData[company][year];
                      return (
                        <TableRow key={`${company}-${year}`}>
                          <TableCell>${revenue.toLocaleString()}</TableCell>
                          {!showOnlyRevenue && (
                            <TableCell>${netIncome.toLocaleString()}</TableCell>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
};

export default ReportingPage;
