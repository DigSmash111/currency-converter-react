import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'https://api.exchangeratesapi.io/latest';

const App = () => {
	const [currencyOptions, setCurrencyOptions] = useState([]);
	const [fromCurrency, setFromCurrency] = useState();
	const [toCurrency, setToCurrency] = useState();
	const [exchangeRate, setExchangeRate] = useState();
	const [amount, setAmount] = useState(1);
	const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

	let toAmount, fromAmount;
	if(amountInFromCurrency) {
		fromAmount = amount;
		toAmount = amount*exchangeRate;
	} else {
		toAmount = amount;
		fromAmount = amount/exchangeRate;
	}

	// console.log(currencyOptions);
	// console.log(exchangeRate);

	// using async/await and axios
	useEffect(() => {
		const fetchAPI = async () => {
			const { data } = await axios.get(BASE_URL);
			// console.log(data);
			
			const firstCurrency = Object.keys(data.rates)[0];
			setCurrencyOptions( [data.base, ...Object.keys(data.rates)] );
			setFromCurrency(data.base);
			setToCurrency(firstCurrency);
			setExchangeRate(data.rates[firstCurrency]);
		}
		fetchAPI();
	}, []);

	useEffect(() => {
		const fetchAPI = async () => {
			const { data } = await axios.get(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`);
			// console.log(data);
			setExchangeRate(data.rates[toCurrency]);
		}
		
		if(fromCurrency != null && toCurrency != null) {
			fetchAPI();
		}

	}, [fromCurrency, toCurrency]);

	// using then/then on Promises
	// useEffect(() => {
	// 	fetch(BASE_URL)
	// 		.then(res => res.json())
	// 		.then(data => console.log(data));
	// }, []);

	const handleFromAmountChange = e => {
		setAmount(e.target.value);
		setAmountInFromCurrency(true);
	}
	const handleToAmountChange = e => {
		setAmount(e.target.value);
		setAmountInFromCurrency(false);
	}

	return (
		<>
			<h1>Convert</h1>
			<CurrencyRow 
				currencyOptions={currencyOptions} 
				selectedCurrency={fromCurrency} 
				onChangeCurency={e => setFromCurrency(e.target.value)}
				onChangeAmount={handleFromAmountChange}
				amount={fromAmount}
			/>
			<div className="equals">=</div>
			<CurrencyRow 
				currencyOptions={currencyOptions} 
				selectedCurrency={toCurrency} 
				onChangeCurency={e => setToCurrency(e.target.value)}
				onChangeAmount={handleToAmountChange}
				amount={toAmount}
			/>
		</>
	);
}

export default App;