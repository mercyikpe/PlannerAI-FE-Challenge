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
