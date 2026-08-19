import { Container, Grid, Paper, Skeleton, Stack } from "@mui/material";
const FullCalendarSkeleton=()=> {
  return(
  <Container sx={{ p: 0.5}}>
    {/* First Paper */}
    <Paper elevation={3} sx={{ p: 1.5 }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        paddingTop={2}
        paddingLeft={2}
        paddingRight={2}
      >
        <Skeleton variant="rounded"  width={80} height={25} sx={{borderRadius:'16px'}} />
        <Skeleton variant="rounded" width={25} height={25} />
      </Grid>
    </Paper>

    {/* Second Paper with spacing above */}
    <Paper elevation={3} sx={{ p: 2, mt: 1}}>
      {/* Weekday Headers */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2} sx={{mb:1}}
      >
        {/* Left controls skeleton */}
        <Grid item>
          <Stack direction="row" spacing={2}>
          <Stack direction="row" spacing={0.1}>
            <Skeleton variant="rectangular" width={50} height={40} />
            <Skeleton variant="rectangular" width={50} height={40} />
          </Stack>
          
            <Skeleton variant="rounded" width={80} height={40}  sx={{marginLeft:"20px"}}  />
          </Stack>
        </Grid>

        {/* Center date skeleton */}
        <Grid item>
          <Skeleton variant="text" width={180} height={40} />
        </Grid>

        {/* Right view buttons skeleton */}
        <Grid item >
          <Stack direction="row" spacing={0.2}>
            <Skeleton variant="rectangular" width={50} height={40} />
            <Skeleton variant="rectangular" width={50} height={40} />
            <Skeleton variant="rectangular" width={50} height={40} />
            <Skeleton variant="rectangular" width={50} height={40} />
          </Stack>
        </Grid>
      </Grid>

      {/* Weekday Header Skeletons */}
      <Grid container spacing={0.2} sx={{ mt: 0 }}>
        {[...Array(7)].map((_, dayIdx) => (
          <Grid item xs={12 / 7} key={dayIdx}>
            <Skeleton variant="rectangular" height={20} />
          </Grid>
        ))}
      </Grid>

      {/* Calendar Grid Skeleton */}
      {[...Array(5)].map((_, weekIdx) => (
        <Grid container spacing={0.2} sx={{ mt: 0 }} key={weekIdx}>
          {[...Array(7)].map((_, dayIdx) => (
            <Grid item xs={12 / 7} key={dayIdx}>
              <Skeleton variant="rectangular" height={80} />
            </Grid>
          ))}
        </Grid>
      ))}
    </Paper>
  </Container>)
}
export default  FullCalendarSkeleton;