A simple password generator function that can be installed as a command-line tool
when using the [Deno](https://deno.land/) javascript runtime.

Generates memorable-yet-secure passwords like the following:
```
KickGoldfishBasis857
ProneGottenDensity494
DisposalUnscathedOverstay51
KnickersQuiverUnread752
ApplyPursuitGranola171
```

Run the following command to generate an executable:
```
deno compile --allow-read --output genpass https://raw.githubusercontent.com/JLCarveth/genpass/master/password_gen.ts
```

Running `genpass` takes no options, and returns a single password to stdout. Optionally, a single parameter can be provided to specify the number of passwords to generate:
```
$ genpass 5
DudingCommunicatePredominant303
YieldedIndependentlyGuiyang330
MicroaggressionsObnoxiousAquarius553
RockinessCounteractedSpin506
TourismVoluntaryJosie740
```
