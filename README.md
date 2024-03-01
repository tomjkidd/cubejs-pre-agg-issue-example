# cubejs-pre-agg-issue-example

This repo demonstrates an issue when using pre-aggregations on calculated measures

# Motivation

In trying to use calculated measures with pre-aggregations, there is a case
where when I issue a cube query for a subset of calculated measures (which works
when a pre-aggregation is not configured) fails to work correctly.

This repo includes cube server configuration for a `CubeRepro` cube, an example
query, a sql INSERT statement to create a dataset that demonstrates the issue,
and a write-up of steps to reproduce the issue.

It appears that the inner sql subquery that is used does not return measures
that the outer sql subquery expects. If I update the query that I issue to
include the missing measures, I can get the pre-aggregation to work. I have
included what I hope is enough information in this repo to reproduce the issue,
and to help verify a potential fix.

# Reproduction Steps

Please see [here](./doc/ReproductionSteps.md) for detailed steps on how to use
this repo to reproduce the issue I'm seeing.
