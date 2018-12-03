install.packages('NMF')
library('NMF')
library('MASS')

############
#exercise 2#
############

source("generate_data.R")
source("permut_label.R")

#NMF and k-means: a comparison
k<-10
data_and_class<-generate_data(k)

data<-data_and_class[[1]]
true_class<-data_and_class[[2]]

#we compute the centers of each cluster, it will be used in the following
centers<-matrix(0,nrow=dim(data)[2],ncol=k)
for (i in (1:k)){
  centers[,i]<-colMeans(data[true_class==i,])
}

#kmeans
res_kmeans<-kmeans(data,k)
table(res_kmeans$cluster,true_class)#we see that there is a permutation on the labels, we would prefer a diagonal contingencies table

#the function 'permut_label', given the initial 'true' centers C_init, the centers resulting from the clustering C_res and the clustering,
#output a new cluster so that C_new has label l the closest initial center has label l. (Remark: if the label of the closest inital center
#has alreafdy been attributed, then a label is attributed at random, see code)
clusters_kmeans<-permut_label(centers,res_kmeans$centers,res_kmeans$cluster) 
table(clusters_kmeans,true_class)

#NMF
nmf<-nmf(data,k,method="snmf/l", nrun=1,seed=111)
res_nmf<-predict(nmf,'rows')
table(res_nmf,true_class)

#here also, we want to relabel the clusters. We first compute the centers of each clusters provided by NMF
centers_nmf<-matrix(0,nrow=dim(centers)[1],ncol=dim(centers)[2])
for (i in (1:k)){
  centers_nmf[,i]<-colMeans(data[res_nmf==i,])
}
centers_nmf<-t(centers_nmf)

#Then we can call the function permut_label
clusters_nmf<-permut_label(centers,centers_nmf ,res_nmf) 
table(clusters_nmf,true_class)


