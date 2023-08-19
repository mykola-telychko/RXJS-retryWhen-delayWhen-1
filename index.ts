import { timer, interval } from 'rxjs';
import { map, tap, retryWhen, delayWhen } from 'rxjs/operators';

// https://www.learnrxjs.io/learn-rxjs/operators/error_handling/retrywhen

//emit value every 1s
const srcInterval = interval(1000);
const example = srcInterval.pipe(
  map((val) => {
    if (val > 3) {
      throw val; //err will be picked up by retryWhen
    }
    return val;
  }),
  retryWhen((errors) =>
    errors.pipe(
      //log error message
      tap((val) => console.log(`Value ${val} was too high!`)),
      //restart in 3 seconds
      delayWhen((val) => timer(val * 1000))
    )
  )
);
/*
  output:
  0
  1
  2
  3
  "Value 6 was too high!"
  --Wait 5 seconds then repeat
*/
const subscribe = example.subscribe((val) => console.log(val));
