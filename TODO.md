* preserve keys order (at least if keys are specified) (?)
* support arrays for rename_rule & restruct
* add "transformers" (how?)
	* relatively easy for "rename_rule", but:
		* note reverse transformation (not necessarily strictly inverse)
		* transformation chains
		* calcs on multiple src fields - expose dependencies?
		* difference between undefined and "not present" cases
