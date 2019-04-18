#!/usr/bin/env python
# coding: utf-8

# In[37]:


# Calculate Averages

def average(l): 
    return sum(l) / len(l) 

import csv
threshold = 0.80
gres = []
toefls = []
urs = []
sops = []
lors = []
cgpas = []
rs = []
with open('graduate-admissions/admission_cleaned.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        gre = int(row['GRE_Score'])
        toefl = int(row['TOEFL_Score'])
        ur = int(row['University_Rating'])
        sop = float(row['SOP'])
        lor = float(row['LOR'])
        cgpa = float(row['CGPA'])
        r = int(row['Research'])
        coa = float(row['Chance_of_Admit'])
        
        if coa >= threshold:
            gres.append(gre)
            toefls.append(toefl)
            urs.append(ur)
            sops.append(sop)
            lors.append(lor)
            cgpas.append(cgpa)
            rs.append(r)

gres_average = int(round(average(gres),0))
toefls_average = int(round(average(toefls),0))
urs_average = int(round(average(urs),0))
sops_average = round(average(sops),1)
lors_average = round(average(lors),1)
cgpas_average = round(average(cgpas),2)
rs_average = int(round(average(rs),0))

averages = [gres_average,toefls_average,urs_average,sops_average,lors_average,cgpas_average,rs_average]
print(averages)


# In[ ]:





# In[ ]:




