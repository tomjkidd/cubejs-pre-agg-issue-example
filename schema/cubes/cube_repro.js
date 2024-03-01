import { cubeReproTable } from "../environment";

cube(`cube_repro`, {
  sql_table: `${cubeReproTable}`,

  data_source: `default`,

  joins: {},

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primary_key: true,
    },

    value: {
      sql: `value`,
      type: `number`,
    },

    date: {
      sql: `date`,
      type: `time`,
    },

    value_category: {
      description: `The category to use for reporting, based on value`,
      type: "string",
      sql: `
CASE
  WHEN ${CUBE.value} >= 175 THEN 'GteThreshold'
  WHEN ${CUBE.value} < 175 THEN 'LtThreshold'
  ELSE 'Pending'
END`,
    },
  },

  measures: {
    count: {
      type: `count`,
    },
    cumulative_count: {
      type: "count",
      rolling_window: {
        trailing: "unbounded",
      },
    },
    mov_avg_count: {
      type: "count",
      rolling_window: {
        trailing: `3 week`,
      },
    },

    gte_count: {
      type: `count`,
      filters: [
        {
          sql: `${CUBE.value_category} = 'GteThreshold'`,
        },
      ],
    },
    gte_cumulative_count: {
      type: "count",
      rolling_window: {
        trailing: "unbounded",
      },
      filters: [
        {
          sql: `${CUBE.value_category} = 'GteThreshold'`,
        },
      ],
    },
    gte_mov_avg_count: {
      type: "count",
      rolling_window: {
        trailing: "3 week",
      },
      filters: [
        {
          sql: `${CUBE.value_category} = 'GteThreshold'`,
        },
      ],
    },

    gte_pct: {
      type: `number`,
      sql: `100.0 * ${CUBE.gte_count} / ${CUBE.count}`,
      format: "percent",
    },
    gte_cumulative_pct: {
      type: `number`,
      sql: `100.0 * ${CUBE.gte_cumulative_count} / ${CUBE.cumulative_count}`,
      format: "percent",
    },
    gte_mov_avg_pct: {
      type: `number`,
      sql: `100.0 * ${CUBE.gte_mov_avg_count} / ${CUBE.mov_avg_count}`,
      format: "percent",
    },
  },

  pre_aggregations: {
    // Pre-aggregation definitions go here.
    // Learn more in the documentation: https://cube.dev/docs/caching/pre-aggregations/getting-started
    main: {
      measures: [
        cube_repro.gte_count,
        cube_repro.count,
        cube_repro.gte_cumulative_count,
        cube_repro.cumulative_count,
        cube_repro.gte_mov_avg_count,
        cube_repro.mov_avg_count,
      ],
      timeDimension: cube_repro.date,
      granularity: `week`,
    },
  },
});
