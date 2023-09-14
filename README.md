# BäckerAI

This project is built with:

- Vue 3 composition API
- Vite
- TypeScript
- TailwindCSS (for styling)
- dayjs for formatting dates
- chart.js for the line chart
- vue-chartjs (a wrapper for chartjs in vue.js with typescript support)
- Prettier (for code formatting)

### deployed link: [https://planner-ai-fe-challenge.vercel.app](https://planner-ai-fe-challenge.vercel.app)


### Estimated time spent: 
5 hours

<br/>

## My proposed solution
I matched the store and product info in the recommendation and delivery dataset in order to get the recommendation and the delivery_qty, then I subtracted the values to find the difference. The difference is the adjustment made by the client. With the adjustment value, I mapped the graph to show the adjustment points. 
Then, I mapped the graph with the actual delivery which is in the sales data set, then I compared the adjustment and the actual delivery. This comparison showed when the adjustment improved or deteriorated actual delivery. to find improved or deteriorated values, I checked the adjustment values to see if the adjustment was closer to the actual delivery or if the recommendation was closer to the actual delivery. 

<br/>

## Limitations

The implementation of the filter by date does not allow a flexible date range selection. A better approach would be to use a date picker so that users can freely select dates.

## Assumptions

I assume that the actual delivery quantity is the data in the `sales.json` file

<br/>
<br/>

#### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Compile and Minify for Production

```sh
npm run build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
