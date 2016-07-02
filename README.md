#<p style="text-align: center;">Universal Angular Select</p>
##<p style="text-align: center;">Create awesome imaginative select directives</p>
<p>
    The <em>Universal Angular Select</em> is not a directive into itself, but a composition of the <em>Revive</em> and
    <em>Group and Sort</em> directives with a representional directive of your choice. The composition of the two directives
    provides you with a powerfull <em>Select</em> directive.
</p>

You incorparate the directive in your html file in the follwoing manner:
```html
    <div revive ng-model="modelProperty">
        <div group-sort objects="modelArrayOfObjects" group-by="groupByFunctionName" 
            sort-categories="sortCategoriesFunctionName" sort-items="sortItemsFunctionName">
            <presentational-directive></presentational-directive>
        </div>
    </div>
```
<p>
    The <em>Universal Angular Select</em> is not a directive into itself, but a composition of the <em>Revive</em> and
    <em>Group and Sort</em> directives with a representional directive with your choice. The composition of the two directives
    provides you with a powerfull <em>Select</em> directive.
</p>
<p>
    Advantages of using the <em>Universal Angular Select</em>
    <ul>
        <li>
            You are no longer bound by the representational constraint of the standard Select directive.
        </li>
        <li>
            Your awesome imaginative select directive need only care about representation logic.
        </li>
        <li>
            ngModel bound - with no additional development!
        </li>
        <li>
            Customised grouping and sorting.
        </li>
        <li>
            Enhanched selectable logic:
            <ul>
                <li>
                    Set maximal number of selctions.
                </li>
                <li>
                    Enable / disable items.
                </li>
                <li>
                    Reset state of Select and underline directives.
                </li>
            </ul>
        </li>
    </ul>
</p>

[Go to Angular-Revive page](https://yuvaloren6.github.io/angular-revive/)


[Go to Angular-groupSort page](https://yuvaloren6.github.io/angular-groupSort/)

